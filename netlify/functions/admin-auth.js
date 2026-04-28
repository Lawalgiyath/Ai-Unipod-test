/**
 * Secure Admin Authentication Function
 * This runs on the server side and never exposes credentials to the client
 */

const crypto = require('crypto');

// Admin credentials stored in environment variables (set in Netlify dashboard)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Simple JWT implementation (in production, use a library like jsonwebtoken)
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Rate limiting headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  try {
    const { email, password } = JSON.parse(event.body);

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password required' })
      };
    }

    // Check credentials
    const passwordHash = hashPassword(password);
    
    if (email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH) {
      // Generate secure token
      const token = generateToken({
        email,
        role: 'admin',
        iat: Date.now()
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          user: {
            email,
            role: 'admin'
          }
        })
      };
    }

    // Invalid credentials - add delay to prevent brute force
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid credentials' })
    };

  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};
