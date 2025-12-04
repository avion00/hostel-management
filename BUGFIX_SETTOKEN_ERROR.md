# Bug Fix: setToken Export Error

## Issue
```
Header.jsx:10 Uncaught SyntaxError: The requested module '/src/redux/features/authSlice.js?t=1764852624211' does not provide an export named 'setToken' (at Header.jsx:10:25)
```

## Root Cause
When we updated the authentication system, we changed the Redux auth slice from using a single `token` field to separate `accessToken` and `refreshToken` fields. The export `setToken` was replaced with `setAccessToken` and `setRefreshToken`.

However, three files were still importing and using the old `setToken` action:
1. `client/src/components/common/sidebar/Sidebar.jsx`
2. `client/src/components/common/sidebar/Mobile-sidebar.jsx`
3. `client/src/components/common/header/Header.jsx`

## Solution
Updated all three files to use the new `useAuth` hook instead of directly managing Redux state. This provides:
- Cleaner code
- Consistent logout behavior
- Proper API calls to invalidate tokens on server
- Better error handling

## Changes Made

### Before (Old Pattern)
```javascript
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import apis from "@/lib/api/api";
import { setIsLoggedIn, setToken, setUser } from "@/redux/features/authSlice";
import { toast } from "sonner";

const dispatch = useDispatch();
const { token } = useSelector((state) => state?.auth);

const handleLogout = async () => {
  try {
    const response = await axios.post(
      apis.logout,
      { token },
      { withCredentials: true }
    );

    if (response?.status === 200) {
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(setIsLoggedIn(false));
      toast.success("User Logout successful.");
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error Logging out");
  }
};
```

### After (New Pattern)
```javascript
import { useAuth } from "@/hooks/useAuth";

const { logout: handleLogout } = useAuth();

// handleLogout is now called directly - it handles everything
```

## Files Modified
1. ✅ `client/src/components/common/sidebar/Sidebar.jsx`
2. ✅ `client/src/components/common/sidebar/Mobile-sidebar.jsx`
3. ✅ `client/src/components/common/header/Header.jsx`

## Benefits of New Approach
1. **Simpler Code** - No need to manually dispatch multiple actions
2. **Consistent** - All logout logic in one place (useAuth hook)
3. **Proper API Integration** - Tokens are invalidated on server
4. **Better Error Handling** - Centralized error handling
5. **Automatic Cleanup** - Redux state cleared automatically
6. **Navigation** - Automatic redirect to login page

## Testing
After this fix:
1. ✅ Application loads without errors
2. ✅ Logout button works in all locations:
   - Desktop sidebar
   - Mobile sidebar
   - Website header
   - Dashboard header
3. ✅ Tokens properly invalidated on server
4. ✅ User redirected to login page after logout
5. ✅ Redux state cleared on logout

## Prevention
To prevent similar issues in the future:
1. Always use `useAuth` hook for auth operations
2. Don't directly import Redux actions for auth
3. Search for old imports when refactoring: `grep -r "setToken" src/`
4. Update all files at once when changing core functionality

## Related Files
- `client/src/hooks/useAuth.js` - Auth hook implementation
- `client/src/redux/features/authSlice.js` - Redux auth state
- `client/src/lib/api/axiosInstance.js` - API client with interceptors
