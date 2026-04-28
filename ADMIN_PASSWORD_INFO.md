# 🔐 Admin Password Information

## How the Admin Password Works

The admin password is **NOT stored in the code** - it's stored securely on the server using environment variables. This means:

✅ **No one can see it by inspecting the website**  
✅ **It's never exposed in the browser**  
✅ **Only you control it through Netlify dashboard**

---

## Setting Your Admin Password

### Step 1: Choose Your Password

Pick a strong password (12+ characters recommended):
- Example: `UniPod2026!Secure`

### Step 2: Generate Password Hash

**On Windows:**
```cmd
scripts\generate-credentials.bat
```

**On Mac/Linux:**
```bash
bash scripts/generate-credentials.sh
```

The script will:
1. Ask you to enter your password
2. Generate a SHA-256 hash
3. Generate a JWT secret
4. Display both for you to copy

### Step 3: Add to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to: **Site Settings** → **Environment Variables**
4. Add these variables:

```
ADMIN_EMAIL = admin@unipod.unilag.edu.ng
ADMIN_PASSWORD_HASH = <paste the hash from Step 2>
JWT_SECRET = <paste the secret from Step 2>
```

### Step 4: Deploy

```bash
netlify deploy --prod
```

---

## Logging In

1. Visit: `https://your-site.netlify.app/login.html`
2. Enter:
   - **Email:** `admin@unipod.unilag.edu.ng`
   - **Password:** Your chosen password (the one you entered in Step 2)
3. Click "Sign In"
4. You'll be redirected to the admin panel

---

## Example Setup

Let's say you choose the password: `MySecurePass123!`

1. Run the credential generator
2. Enter: `MySecurePass123!`
3. You get a hash like: `a1b2c3d4e5f6...` (64 characters)
4. Add that hash to Netlify as `ADMIN_PASSWORD_HASH`
5. Deploy
6. Login with email `admin@unipod.unilag.edu.ng` and password `MySecurePass123!`

---

## Important Notes

⚠️ **The password itself is NEVER stored anywhere**  
⚠️ **Only the hash is stored (one-way encryption)**  
⚠️ **Even if someone gets the hash, they can't reverse it to get your password**  
⚠️ **Keep your password safe - store it in a password manager**

---

## Changing Your Password

If you need to change your password:

1. Run the credential generator again with a new password
2. Update `ADMIN_PASSWORD_HASH` in Netlify with the new hash
3. Redeploy (or just update the environment variable)
4. Old password stops working immediately
5. New password works right away

---

## Security Features

✅ **SHA-256 Hashing** - Industry standard password hashing  
✅ **Server-Side Validation** - Password never sent to browser  
✅ **JWT Tokens** - Secure session management  
✅ **24-Hour Expiry** - Automatic logout for security  
✅ **Brute Force Protection** - 1-second delay on failed attempts  

---

## Troubleshooting

### "Invalid credentials" error

**Possible causes:**
1. Wrong password entered
2. Password hash not set in Netlify
3. Email doesn't match exactly

**Solution:**
1. Double-check your password
2. Verify `ADMIN_PASSWORD_HASH` is set in Netlify
3. Ensure email is exactly: `admin@unipod.unilag.edu.ng`

### Can't access admin panel

**Possible causes:**
1. Not logged in
2. Session expired (24 hours)
3. JWT_SECRET not set

**Solution:**
1. Go to `/login.html` and sign in
2. If session expired, just login again
3. Verify `JWT_SECRET` is set in Netlify

---

## Quick Reference

**Login URL:** `https://your-site.com/login.html`  
**Admin Email:** `admin@unipod.unilag.edu.ng`  
**Password:** Your chosen password (set via credential generator)  

**Environment Variables Needed:**
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`

---

## For More Help

See these files:
- `START_HERE.md` - Quick start guide
- `DEPLOYMENT_SECURITY.md` - Detailed setup
- `SECURITY_README.md` - Security overview

---

**Last Updated:** April 2026  
**Security Level:** Production Ready 🔒
