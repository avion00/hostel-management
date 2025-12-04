const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN || 'http://localhost:5000/api';

const apis = {
  // auth
  signup: `${backendDomain}/auth/signup`,
  login: `${backendDomain}/auth/login`,
  logout: `${backendDomain}/auth/logout`,
  refresh: `${backendDomain}/auth/refresh`,
  me: `${backendDomain}/auth/me`,

  // users
  listUser: `${backendDomain}/users`,
  approveUser: `${backendDomain}/users/approve`,

  // properties
  getProperties: `${backendDomain}/properties`,
  getPropertyById: (id) => `${backendDomain}/properties/${id}`,
  createProperty: `${backendDomain}/properties`,
  updateProperty: (id) => `${backendDomain}/properties/${id}`,
  deleteProperty: (id) => `${backendDomain}/properties/${id}`,
  
  // bookings
  createBooking: `${backendDomain}/bookings`,
  getStudentBookings: `${backendDomain}/bookings/student`,
  getPropertyBookings: (propertyId) => `${backendDomain}/bookings/property/${propertyId}`,
  
  // dashboard
  userDashboard: `${backendDomain}/dashboard/user`,
  managerDashboard: `${backendDomain}/dashboard/manager`,
  adminDashboard: `${backendDomain}/dashboard/admin`,
};

export default apis;
