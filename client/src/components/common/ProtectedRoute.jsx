import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '@/lib/api/axiosInstance';
import apis from '@/lib/api/api';
import { setUser, logout } from '@/redux/features/authSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, accessToken, user } = useSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // If not logged in, redirect to login
      if (!isLoggedIn || !accessToken) {
        setIsVerifying(false);
        setIsAuthorized(false);
        return;
      }

      try {
        // Verify token by fetching user data
        const response = await axiosInstance.get(apis.me);
        
        if (response.data.success) {
          const userData = response.data.data;
          dispatch(setUser(userData));
          
          // Check if user role is allowed
          if (allowedRoles.length === 0 || allowedRoles.includes(userData.role.toLowerCase())) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          dispatch(logout());
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        dispatch(logout());
        setIsAuthorized(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [isLoggedIn, accessToken, dispatch, allowedRoles]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but not authorized for this route
  if (!isAuthorized) {
    // Redirect based on user role to their appropriate dashboard
    const userRole = user?.role?.toLowerCase();
    if (userRole === 'student') {
      return <Navigate to="/dashboard/user/overview" replace />;
    } else if (userRole === 'manager') {
      return <Navigate to="/dashboard/owner/overview" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin/overview" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
