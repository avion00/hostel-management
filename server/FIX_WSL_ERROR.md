# 🔧 Fix WSL Better-SQLite3 Error

## The Problem

You're getting this error:
```
Error: better_sqlite3.node: invalid ELF header
```

This happens because `better-sqlite3` was compiled for Windows, but you're running it in WSL (Linux).

## The Solution

**Run this command in your WSL terminal:**

```bash
cd /mnt/e/bikram-project/hostel-management/server
npm rebuild better-sqlite3
```

This will recompile `better-sqlite3` for Linux.

## Step-by-Step

1. **Open WSL Terminal** (you're already in it based on your prompt `root@pro-max`)

2. **Navigate to server directory:**
   ```bash
   cd /mnt/e/bikram-project/hostel-management/server
   ```

3. **Rebuild better-sqlite3:**
   ```bash
   npm rebuild better-sqlite3
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## What I Already Fixed

✅ **Swagger YAML error** - Fixed duplicate `/bookings/{id}` path
✅ **Error handling** - Server won't crash on auth errors

## After Rebuilding

The server should start successfully:
```
✅ SQLite Database initialized successfully
🚀 Server is running on http://localhost:5000
📝 API Documentation: http://localhost:5000/
```

## If Rebuild Fails

Try a clean reinstall:

```bash
# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Start server
npm run dev
```

## Summary

1. ✅ Swagger error - **FIXED** (duplicate path removed)
2. ⚠️ Better-sqlite3 - **Run `npm rebuild better-sqlite3` in WSL**

After rebuilding, your server will work perfectly! 🚀
