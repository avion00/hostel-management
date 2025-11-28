import api from './api';

export const hostelService = {
  // Get all hostels with filters
  getHostels: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/hostels?${params.toString()}`);
    return response.data;
  },

  // Get single hostel
  getHostel: async (id) => {
    const response = await api.get(`/hostels/${id}`);
    return response.data;
  },

  // Get featured hostels
  getFeaturedHostels: async () => {
    const response = await api.get('/hostels/featured');
    return response.data;
  },

  // Create hostel (for partners)
  createHostel: async (hostelData) => {
    const response = await api.post('/hostels', hostelData);
    return response.data;
  },

  // Update hostel
  updateHostel: async (id, hostelData) => {
    const response = await api.put(`/hostels/${id}`, hostelData);
    return response.data;
  },

  // Delete hostel
  deleteHostel: async (id) => {
    const response = await api.delete(`/hostels/${id}`);
    return response.data;
  },

  // Search hostels
  searchHostels: async (searchQuery) => {
    const response = await api.get(`/hostels?search=${searchQuery}`);
    return response.data;
  },
};

export default hostelService;
