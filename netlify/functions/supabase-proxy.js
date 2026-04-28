/**
 * Supabase Proxy Function
 * Securely proxies requests to Supabase without exposing API keys
 */

const fetch = require('node-fetch');

// Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key (never exposed to client)

// Verify JWT token
function verifyToken(token, secret) {
  try {
    const [header, payload, signature] = token.split('.');
    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    // Check expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Verify authentication for write operations
    if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }

      const token = authHeader.substring(7);
      const JWT_SECRET = process.env.JWT_SECRET;
      const user = verifyToken(token, JWT_SECRET);

      if (!user || user.role !== 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Forbidden' })
        };
      }
    }

    // Parse request
    const { table, method, id, data, query } = JSON.parse(event.body || '{}');

    // Build Supabase URL
    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    if (id) url += `?id=eq.${id}`;
    if (query) url += `?${new URLSearchParams(query).toString()}`;

    // Make request to Supabase
    const response = await fetch(url, {
      method: method || event.httpMethod,
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const result = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
