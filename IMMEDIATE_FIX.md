# Immediate Fix for 429 Error

## The Problem
You're rate-limited on ALL accounts because the rate limiting is tracking attempts globally.

## FASTEST SOLUTION - Restart Backend Server

The rate limiting is stored in memory, so restarting the backend will clear it:

### Steps:

1. **Stop the backend server**:
   - Go to the terminal running `npm run dev` in the `server` folder
   - Press `Ctrl + C`

2. **Start it again**:
   ```bash
   cd server
   npm run dev
   ```

3. **Try logging in again**:
   - Email: `admin@hostel.com`
   - Password: `password123`

This will immediately clear all rate limits! ✅

## Alternative: Use Fresh Email

If you don't want to restart, try an account you haven't used yet:

```
Email: student2@example.com
Password: password123
```

Or:
```
Email: manager2@hostel.com
Password: password123
```

## Why This Happens

The backend tracks failed login attempts to prevent brute force attacks. After 5 failed attempts, it blocks further attempts for 15 minutes.

## After Restart

Once you restart the backend:
- All rate limits cleared ✅
- All login attempts reset ✅
- You can login immediately ✅

## Quick Command

```bash
# In server directory
Ctrl + C  # Stop server
npm run dev  # Start again
```

That's it! The 429 error will be gone.
