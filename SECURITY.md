# Security Guide - AI UniPod Lagos CMS

## Overview

This document outlines the security measures implemented to protect the AI UniPod Lagos website and CMS.

## Security Features

### 1. Authentication & Authorization

- **Secure Login System**: Admin panel protected by email/password authentication
- **JWT Tokens**: Session management using JSON Web Tokens
- **Server-Side Validation**: All authentication happens on the server (Netlify Functions)
- **No Client-Side Credentials**: API keys and secrets never exposed in frontend code
- **Session Expiry**: Automatic logout after 24 hours of inactivity

### 2. API Security

- **Proxy Pattern**: All Supabase requests go through secure serverless functions
- **Environment Variables**: Sensitive credentials stored in environment variables
- **Role-Based Access**: Only authenticated admins can perform write operations
- **Rate Limiting**: Protection against brute force and DDoS attacks

### 3. Data Protection

- **Password Hashing**: SHA-256 hashing for password storage
- **HTTPS Only**: All traffic encrypted with TLS
- **Secure Headers**: CSP, X-Frame-Options, X-XSS-Protection, etc.
- **Input Validation**: All user inputs sanitized and validated

### 4. Frontend Security

- **Content Security Policy**: Restricts resource loading to trusted sources
- **XSS Protection**: Prevents cross-site scripting attacks
- **CSRF Protection**: Token-based protection for state-changing operations
- **No Inline Secrets**: All sensitive data loaded from secure backend

## Setup Instructions

### 1. Generate Secure Credentials

```bash
# Generate password hash
echo -n "your-secure-password" | sha256sum

# Generate JWT secret
openssl rand -hex 32
```

### 2. Configure Environment Variables

In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Add the following variables:

```
ADMIN_EMAIL=admin@unipod.unilag.edu.ng
ADMIN_PASSWORD_HASH=<your-generated-hash>
JWT_SECRET=<your-generated-secret>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>
```

### 3. Supabase Row Level Security (RLS)

Enable RLS on all tables:

```sql
-- Enable RLS on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON partners FOR SELECT USING (published = true);

-- Allow authenticated admin write access
CREATE POLICY "Admin write access" ON news FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write access" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write access" ON programs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write access" ON gallery FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write access" ON partners FOR ALL USING (auth.role() = 'service_role');
```

## Security Best Practices

### For Administrators

1. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
2. **Keep Credentials Secret**: Never share login details or commit them to Git
3. **Regular Updates**: Keep all dependencies and packages up to date
4. **Monitor Access**: Review admin panel access logs regularly
5. **Secure Devices**: Only access admin panel from secure, trusted devices
6. **Logout When Done**: Always sign out after finishing admin tasks

### For Developers

1. **Never Commit Secrets**: Use `.gitignore` to exclude `.env` files
2. **Use Environment Variables**: Store all sensitive data in environment variables
3. **Validate All Inputs**: Sanitize and validate all user inputs
4. **Keep Dependencies Updated**: Regularly update npm packages
5. **Review Code**: Conduct security reviews before deploying
6. **Test Security**: Regularly test authentication and authorization

## Incident Response

If you suspect a security breach:

1. **Immediately**: Change all passwords and regenerate JWT secret
2. **Revoke Access**: Invalidate all active sessions
3. **Audit Logs**: Review Supabase and Netlify logs for suspicious activity
4. **Update Credentials**: Rotate all API keys and secrets
5. **Notify Team**: Inform relevant stakeholders
6. **Document**: Record the incident and response actions

## Security Checklist

- [ ] Environment variables configured in Netlify
- [ ] Strong admin password set (12+ characters)
- [ ] JWT secret generated and configured
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced on all pages
- [ ] Security headers configured in netlify.toml
- [ ] `.env` file added to `.gitignore`
- [ ] Admin panel accessible only via login
- [ ] Regular security audits scheduled

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Netlify Security](https://docs.netlify.com/security/secure-access-to-sites/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## Contact

For security concerns or to report vulnerabilities:
- Email: security@unipod.unilag.edu.ng
- Do not disclose vulnerabilities publicly until they are resolved

---

Last Updated: April 2026
