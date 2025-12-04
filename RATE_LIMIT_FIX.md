# Rate Limit (429 Error) Fix

## Problem

You're getting a **429 Too Many Requests** error because you made too many failed login attempts. The backend has rate limiting that locks accounts after 5 failed attempts.

## Quick Solutions

### Option 1: Wait 15 Minutes ⏰
The rate limit automatically expires after 15 minutes. Just wait and try again.

### Option 2: Use a Different Test Account 🔄
Instead of the account you were trying, use a different one:

```
Email: manager1@hostel.com
Password: password123
```

Or:
```
Email: admin@hostel.com
Password: password123
```

### Option 3: Clear Login Attempts (Manual) 🛠️

If you have database access, you can manually clear the attempts:

**Using DB Browser for SQLite:**
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `server/hostel_management.db`
3. Go to "Execute SQL" tab
4. Run: `DELETE FROM login_attempts;`
5. Click "Write Changes"

**Using Command Line (if you have sqlite3):**
```bash
cd server
sqlite3 hostel_management.db "DELETE FROM login_attempts;"
```

## What Changed

### Frontend Error Handling
Added proper handling for 429 errors in the login page:

```javascript
else if (status === 429) {
  toast.error("Too many login attempts. Please wait a few minutes and try again.");
}
```

Now you'll see a clear message instead of a generic error.

## Why This Happened

1. You tried to login multiple times with wrong credentials
2. Backend rate limiting kicked in after 5 failed attempts
3. Account is temporarily locked for 15 minutes

## Prevention

- Use correct test credentials from the start
- Check TEST_CREDENTIALS.md for valid accounts
- Don't spam login attempts
- The test credentials box now shows on the login page

## Current Status

✅ **Connection Fixed** - Frontend now connects to correct backend URL (port 5000)
✅ **Error Handling Added** - 429 errors now show helpful message
⏰ **Rate Limit Active** - Wait 15 minutes OR use different account

## Test Credentials (All use password: password123)

| Role | Email | Status |
|------|-------|--------|
| Admin | admin@hostel.com | ✅ Available |
| Manager | manager1@hostel.com | ✅ Available |
| Manager | manager2@hostel.com | ✅ Available |
| Student | student1@example.com | ⏰ May be rate limited |
| Student | student2@example.com | ✅ Available |

## Recommended Action

**Try logging in with a different account:**

1. Go to http://localhost:5173/login
2. Use: `admin@hostel.com` / `password123`
3. Should work immediately! ✅

## Backend Rate Limiting Rules

- **Max Failed Attempts**: 5
- **Lock Duration**: 15 minutes
- **Applies To**: Email address (not IP)
- **Resets On**: Successful login

## Errors You Might See

| Error | Meaning | Solution |
|-------|---------|----------|
| 429 | Too many requests | Wait 15 min or use different account |
| 423 | Account locked | Wait 15 minutes |
| 401 | Wrong credentials | Check email/password |
| Network Error | Backend not running | Start backend server |

## Summary

The main issue (connection to wrong port) is **FIXED** ✅

The 429 error is just rate limiting from previous failed attempts. Either:
- ⏰ Wait 15 minutes
- 🔄 Use a different test account (recommended)

**Quick Fix**: Try `admin@hostel.com` / `password123` right now!
