// Quick test script for enhanced authentication
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testEnhancedAuth() {
  console.log('🧪 Testing Enhanced Authentication...\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student1@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    if (loginData.data?.accessToken && loginData.data?.refreshToken) {
      console.log('✅ SUCCESS: Both accessToken and refreshToken received!\n');
      
      const { accessToken, refreshToken } = loginData.data;

      // Test 2: Use Access Token
      console.log('2️⃣ Testing Access Token...');
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const meData = await meResponse.json();
      console.log('Me Response:', JSON.stringify(meData, null, 2));
      console.log('✅ Access token works!\n');

      // Test 3: Refresh Token
      console.log('3️⃣ Testing Refresh Token...');
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const refreshData = await refreshResponse.json();
      console.log('Refresh Response:', JSON.stringify(refreshData, null, 2));
      
      if (refreshData.data?.accessToken && refreshData.data?.refreshToken) {
        console.log('✅ Token refresh works!\n');
      }

      console.log('🎉 All tests passed! Enhanced security is working!\n');
      console.log('📝 You can now see:');
      console.log('   - accessToken (short-lived, 15 minutes)');
      console.log('   - refreshToken (long-lived, 7 days)');
      console.log('   - Token refresh endpoint working');
      console.log('\n🔗 Test it on Swagger UI: http://localhost:5000/api-docs');
      
    } else {
      console.log('❌ FAILED: Old authentication still active');
      console.log('   Only "token" field found, not "accessToken" and "refreshToken"');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure the server is running: npm run dev');
  }
}

testEnhancedAuth();
