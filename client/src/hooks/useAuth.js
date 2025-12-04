import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '@/redux/features/authSlice';
import axiosInstance from '@/lib/api/axiosInstance';
import apis from '@/lib/api/api';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, accessToken, refreshToken } = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      // Call logout API to invalidate tokens on server
      await axiosInstance.post(apis.logout, {
        refreshToken: refreshToken
      });
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout on client side even if API call fails
    } finally {
      // Clear Redux state
      dispatch(logoutAction());
      // Redirect to login
      navigate('/login');
    }
  };

  const isAuthenticated = () => {
    return isLoggedIn && accessToken;
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    const userRole = user.role.toLowerCase();
    return Array.isArray(roles) 
      ? roles.map(r => r.toLowerCase()).includes(userRole)
      : roles.toLowerCase() === userRole;
  };

  return {
    user,
    isLoggedIn,
    accessToken,
    refreshToken,
    logout,
    isAuthenticated,
    hasRole,
  };
};
