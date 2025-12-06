import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let token = '';

async function testUserManagement() {
  try {
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hostel.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      token = loginResponse.data.data.accessToken;
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed');
      return;
    }

    console.log('\n2. Testing user stats endpoint...');
    try {
      const statsResponse = await axios.get(`${API_URL}/admin/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ User stats endpoint working');
      console.log('Stats:', statsResponse.data.data);
    } catch (error) {
      console.log('❌ User stats endpoint failed:', error.response?.status, error.response?.data);
    }

    console.log('\n3. Testing users list endpoint...');
    try {
      const usersResponse = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users list endpoint working');
      console.log('Users count:', usersResponse.data.data.length);
    } catch (error) {
      console.log('❌ Users list endpoint failed:', error.response?.status, error.response?.data);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testUserManagement();
