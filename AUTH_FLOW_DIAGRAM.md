# Authentication Flow Diagrams

## 1. Login Flow

```
┌─────────────┐
│   User      │
│ enters      │
│ credentials │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Login Component                        │
│  (pages/authentication/login/Main.jsx)  │
└──────┬──────────────────────────────────┘
       │
       │ POST /api/auth/login
       │ { email, password }
       ▼
┌─────────────────────────────────────────┐
│  Axios Instance                         │
│  (lib/api/axiosInstance.js)             │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Backend API                            │
│  (server/src/controllers/authController)│
└──────┬──────────────────────────────────┘
       │
       │ Returns:
       │ - accessToken
       │ - refreshToken
       │ - user data
       ▼
┌─────────────────────────────────────────┐
│  Redux Store                            │
│  - setAccessToken()                     │
│  - setRefreshToken()                    │
│  - setUser()                            │
│  - setIsLoggedIn(true)                  │
└──────┬──────────────────────────────────┘
       │
       │ Persisted to localStorage
       │ via redux-persist
       ▼
┌─────────────────────────────────────────┐
│  Navigate to Dashboard                  │
│  - student → /                          │
│  - manager → /dashboard/owner/overview  │
│  - admin → /dashboard/admin/overview    │
└─────────────────────────────────────────┘
```

## 2. Protected Route Access Flow

```
┌─────────────┐
│   User      │
│ navigates   │
│ to route    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Router                                 │
│  (constant/router.jsx)                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  ProtectedRoute Component               │
│  (components/common/ProtectedRoute.jsx) │
└──────┬──────────────────────────────────┘
       │
       ├─── Check: isLoggedIn? ────┐
       │                            │
       │ YES                        │ NO
       ▼                            ▼
┌──────────────────┐      ┌─────────────────┐
│ Verify Token     │      │ Redirect to     │
│ GET /api/auth/me │      │ /login          │
└────┬─────────────┘      └─────────────────┘
     │
     ├─── Token Valid? ───┐
     │                    │
     │ YES                │ NO
     ▼                    ▼
┌──────────────────┐  ┌─────────────────┐
│ Check Role       │  │ Logout &        │
│ Matches?         │  │ Redirect /login │
└────┬─────────────┘  └─────────────────┘
     │
     ├─── Role OK? ──────┐
     │                   │
     │ YES               │ NO
     ▼                   ▼
┌──────────────────┐  ┌─────────────────┐
│ Render Page      │  │ Redirect to     │
│                  │  │ User's Dashboard│
└──────────────────┘  └─────────────────┘
```

## 3. Automatic Token Refresh Flow

```
┌─────────────┐
│   User      │
│ makes API   │
│ request     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Axios Instance                         │
│  Request Interceptor                    │
│  - Adds Authorization header            │
└──────┬──────────────────────────────────┘
       │
       │ Authorization: Bearer <accessToken>
       ▼
┌─────────────────────────────────────────┐
│  Backend API                            │
└──────┬──────────────────────────────────┘
       │
       ├─── Token Valid? ───┐
       │                    │
       │ YES                │ NO (401)
       ▼                    ▼
┌──────────────────┐  ┌─────────────────────────────┐
│ Return Response  │  │ Response Interceptor        │
│                  │  │ Catches 401 Error           │
└──────────────────┘  └────┬────────────────────────┘
                           │
                           ├─── Already Refreshing? ─┐
                           │                          │
                           │ NO                       │ YES
                           ▼                          ▼
                    ┌──────────────────┐    ┌──────────────────┐
                    │ Set isRefreshing │    │ Queue Request    │
                    │ = true           │    │                  │
                    └────┬─────────────┘    └────┬─────────────┘
                         │                       │
                         │ POST /api/auth/refresh│
                         │ { refreshToken }      │
                         ▼                       │
                    ┌──────────────────┐         │
                    │ Get New Tokens   │         │
                    │ - accessToken    │         │
                    │ - refreshToken   │         │
                    └────┬─────────────┘         │
                         │                       │
                         ├─── Success? ──┐       │
                         │                │      │
                         │ YES            │ NO   │
                         ▼                ▼      │
                    ┌──────────────┐  ┌──────────┴──────┐
                    │ Update Redux │  │ Logout User     │
                    │ Store        │  │ Redirect /login │
                    └────┬─────────┘  └─────────────────┘
                         │
                         │ Process Queued Requests
                         ▼
                    ┌──────────────────┐
                    │ Retry Original   │
                    │ Request with     │
                    │ New Token        │
                    └────┬─────────────┘
                         │
                         ▼
                    ┌──────────────────┐
                    │ Return Response  │
                    │ to Caller        │
                    └──────────────────┘
```

## 4. Logout Flow

```
┌─────────────┐
│   User      │
│ clicks      │
│ Logout      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  useAuth Hook                           │
│  logout() function                      │
└──────┬──────────────────────────────────┘
       │
       │ POST /api/auth/logout
       │ { refreshToken }
       ▼
┌─────────────────────────────────────────┐
│  Backend API                            │
│  - Blacklist access token               │
│  - Revoke refresh token                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Redux Store                            │
│  dispatch(logout())                     │
│  - Clear accessToken                    │
│  - Clear refreshToken                   │
│  - Clear user                           │
│  - Set isLoggedIn = false               │
└──────┬──────────────────────────────────┘
       │
       │ Clear from localStorage
       │ via redux-persist
       ▼
┌─────────────────────────────────────────┐
│  Navigate to /login                     │
└─────────────────────────────────────────┘
```

## 5. Page Refresh Flow (Token Persistence)

```
┌─────────────┐
│   User      │
│ refreshes   │
│ page (F5)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Redux Persist                          │
│  Rehydrates state from localStorage     │
└──────┬──────────────────────────────────┘
       │
       ├─── Has Tokens? ───┐
       │                   │
       │ YES               │ NO
       ▼                   ▼
┌──────────────────┐  ┌─────────────────┐
│ Restore Auth     │  │ Show Login      │
│ State            │  │ Page            │
│ - accessToken    │  └─────────────────┘
│ - refreshToken   │
│ - user           │
│ - isLoggedIn     │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ User Remains     │
│ Logged In        │
│                  │
│ Can Access       │
│ Protected Routes │
└──────────────────┘
```

## 6. Multiple API Calls During Token Refresh

```
Request 1 ──┐
            │
Request 2 ──┼──► All get 401 error
            │
Request 3 ──┘
     │
     ▼
┌─────────────────────────────────────────┐
│  First request triggers refresh         │
│  isRefreshing = true                    │
└──────┬──────────────────────────────────┘
       │
       ├──► Request 1: Starts refresh
       │
       ├──► Request 2: Queued (waits)
       │
       └──► Request 3: Queued (waits)
       │
       ▼
┌─────────────────────────────────────────┐
│  Refresh completes                      │
│  New tokens obtained                    │
└──────┬──────────────────────────────────┘
       │
       ├──► Request 1: Retried with new token
       │
       ├──► Request 2: Retried with new token
       │
       └──► Request 3: Retried with new token
       │
       ▼
┌─────────────────────────────────────────┐
│  All requests succeed                   │
└─────────────────────────────────────────┘
```

## 7. Role-Based Access Control

```
                    ┌─────────────┐
                    │   User      │
                    │ Logged In   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ Student │       │ Manager │       │  Admin  │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                 │                  │
        │                 │                  │
   ┌────▼─────────────────▼──────────────────▼────┐
   │         Check Route Permissions               │
   └────┬─────────────────┬──────────────────┬────┘
        │                 │                  │
        ▼                 ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ /       │       │/dashboard│       │/dashboard│
   │ /bookings│      │/owner/*  │       │/admin/* │
   │ /payments│      │         │       │         │
   └─────────┘       └─────────┘       └─────────┘
        │                 │                  │
        ▼                 ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ Allowed │       │ Allowed │       │ Allowed │
   └─────────┘       └─────────┘       └─────────┘
```

## Component Interaction Diagram

```
┌───────────────────────────────────────────────────────┐
│                    Application                        │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │           Redux Store                       │    │
│  │  ┌────────────────────────────────────┐    │    │
│  │  │  Auth State                        │    │    │
│  │  │  - accessToken                     │    │    │
│  │  │  - refreshToken                    │    │    │
│  │  │  - user                            │    │    │
│  │  │  - isLoggedIn                      │    │    │
│  │  └────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘    │
│                       ▲                              │
│                       │                              │
│  ┌────────────────────┴──────────────────────┐      │
│  │                                            │      │
│  │  ┌──────────────┐      ┌──────────────┐  │      │
│  │  │   Login      │      │  useAuth     │  │      │
│  │  │   Component  │      │  Hook        │  │      │
│  │  └──────┬───────┘      └──────┬───────┘  │      │
│  │         │                     │           │      │
│  │         └─────────┬───────────┘           │      │
│  │                   │                       │      │
│  │                   ▼                       │      │
│  │         ┌──────────────────┐              │      │
│  │         │  Axios Instance  │              │      │
│  │         │  - Interceptors  │              │      │
│  │         └────────┬─────────┘              │      │
│  │                  │                        │      │
│  │                  ▼                        │      │
│  │         ┌──────────────────┐              │      │
│  │         │  Backend API     │              │      │
│  │         └──────────────────┘              │      │
│  │                                            │      │
│  └────────────────────────────────────────────┘      │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │         Protected Routes                    │    │
│  │  ┌────────────────────────────────────┐    │    │
│  │  │  ProtectedRoute Component          │    │    │
│  │  │  - Verifies authentication         │    │    │
│  │  │  - Checks user role                │    │    │
│  │  │  - Redirects if unauthorized       │    │    │
│  │  └────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Token Lifecycle

```
┌─────────────────────────────────────────────────────┐
│                  Token Lifecycle                    │
└─────────────────────────────────────────────────────┘

Login
  │
  ▼
┌─────────────────┐
│ Access Token    │ Expires: 15 minutes
│ Refresh Token   │ Expires: 7 days
└────────┬────────┘
         │
         │ Time passes...
         │
         ▼
┌─────────────────┐
│ Access Token    │ EXPIRED
│ Refresh Token   │ Still valid
└────────┬────────┘
         │
         │ API call triggers refresh
         ▼
┌─────────────────┐
│ New Access      │ Expires: 15 minutes
│ New Refresh     │ Expires: 7 days
└────────┬────────┘
         │
         │ Cycle continues...
         │
         ▼
┌─────────────────┐
│ Both Expired    │ User must login again
└─────────────────┘
```

## Data Flow Summary

```
User Action → Component → useAuth/Redux → Axios Instance
                                              ↓
                                         Backend API
                                              ↓
                                         Response
                                              ↓
                                    Axios Interceptor
                                    (handles errors)
                                              ↓
                                         Redux Store
                                              ↓
                                    Component Re-renders
                                              ↓
                                         UI Updates
```
