# Environment Configuration Fix

## Problem Identified

The frontend `.env` file had the **wrong backend URL**:

### Before (Wrong)
```env
VITE_BACKEND_DOMAIN="http://localhost:8000/api/v1"
```

### After (Correct)
```env
VITE_BACKEND_DOMAIN=http://localhost:5000/api
```

## What Was Wrong

1. **Wrong Port**: `8000` → Should be `5000`
2. **Wrong Path**: `/api/v1` → Should be `/api`
3. **Extra Quotes**: Had unnecessary quotes around the URL

## Error This Caused

```
POST http://localhost:8000/api/v1/auth/login net::ERR_CONNECTION_REFUSED
```

The frontend was trying to connect to port 8000 (which doesn't exist), causing connection refused errors.

## Fix Applied

Updated `client/.env` file to:
```env
VITE_BACKEND_DOMAIN=http://localhost:5000/api
```

## Next Steps

**IMPORTANT**: You must restart your frontend dev server for the changes to take effect!

### Steps to Apply Fix:

1. **Stop the frontend server**:
   - Press `Ctrl + C` in the terminal running `npm run dev`

2. **Restart the frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Test the login**:
   - Go to http://localhost:5173/login
   - Use test credentials:
     - Email: `student1@example.com`
     - Password: `password123`
   - Should now work! ✅

## Why Restart is Needed

Vite (the frontend build tool) only reads environment variables when it starts. Changes to `.env` files require a full restart to take effect. Hot Module Replacement (HMR) doesn't reload environment variables.

## Verification

After restarting, check the browser console. You should see:
- ✅ `POST http://localhost:5000/api/auth/login` (correct URL)
- ✅ Status 200 (successful login)
- ❌ No more `ERR_CONNECTION_REFUSED` errors

## Backend vs Frontend URLs

| Service | URL | Port |
|---------|-----|------|
| **Backend API** | http://localhost:5000 | 5000 |
| **Frontend** | http://localhost:5173 | 5173 |

## Environment Variables

### Client `.env`
```env
VITE_BACKEND_DOMAIN=http://localhost:5000/api
```

### Server `.env`
```env
PORT=5000
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
NODE_ENV=development
DATABASE_URL=./hostel_management.db
```

## Common Issues

### Issue: Still getting connection errors after restart
**Solution**: 
- Make sure you fully stopped and restarted (not just saved files)
- Clear browser cache
- Check backend is running on port 5000

### Issue: Backend not responding
**Solution**:
```bash
cd server
npm run dev
```
Should see: `🚀 Server is running on http://localhost:5000`

### Issue: Wrong port in browser
**Solution**:
- Frontend should be: http://localhost:5173
- Not: http://localhost:8000 or http://localhost:5000

## Testing Checklist

After restart:
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend running at http://localhost:5000
- [ ] Login page shows test credentials
- [ ] Login with `student1@example.com` / `password123` works
- [ ] No connection errors in console
- [ ] Redirects to home page after login

## Summary

✅ **Fixed**: Updated `.env` file with correct backend URL
⚠️ **Action Required**: Restart frontend dev server
✅ **Expected Result**: Login should now work without connection errors

The issue was simply a misconfigured environment variable pointing to the wrong port and path!
