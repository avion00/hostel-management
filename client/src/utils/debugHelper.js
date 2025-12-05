// Debug helper to track all network requests
export const setupNetworkDebugger = () => {
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override fetch to log all requests
  window.fetch = async (...args) => {
    const [url, options] = args;
    
    console.group(`🌐 Network Request: ${options?.method || 'GET'} ${url}`);
    console.log('📤 Request Headers:', options?.headers);
    console.log('📦 Request Body:', options?.body);
    console.groupEnd();
    
    try {
      const response = await originalFetch(...args);
      const clonedResponse = response.clone();
      
      console.group(`🌐 Network Response: ${response.status} ${url}`);
      console.log('📥 Status:', response.status, response.statusText);
      console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
      
      try {
        const data = await clonedResponse.json();
        console.log('📥 Response Data:', data);
      } catch (e) {
        console.log('📥 Response (non-JSON)');
      }
      console.groupEnd();
      
      return response;
    } catch (error) {
      console.group(`❌ Network Error: ${url}`);
      console.error('Error:', error);
      console.groupEnd();
      throw error;
    }
  };
  
  // Also track XMLHttpRequest (used by axios)
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._debugInfo = { method, url };
    console.log(`🔷 XHR Request Prepared: ${method} ${url}`);
    return originalXHROpen.apply(this, [method, url, ...args]);
  };
  
  XMLHttpRequest.prototype.send = function(body) {
    const info = this._debugInfo;
    
    console.group(`🔷 XHR Request: ${info?.method} ${info?.url}`);
    if (body) {
      try {
        console.log('📤 Request Body:', JSON.parse(body));
      } catch {
        console.log('📤 Request Body:', body);
      }
    }
    console.groupEnd();
    
    this.addEventListener('load', function() {
      console.group(`🔷 XHR Response: ${this.status} ${info?.url}`);
      console.log('📥 Status:', this.status, this.statusText);
      try {
        console.log('📥 Response:', JSON.parse(this.responseText));
      } catch {
        console.log('📥 Response:', this.responseText);
      }
      console.groupEnd();
    });
    
    this.addEventListener('error', function() {
      console.error(`❌ XHR Error: ${info?.url}`);
    });
    
    return originalXHRSend.apply(this, [body]);
  };
  
  console.log('🔍 Network debugger activated - All requests will be logged');
};

// Form submission debugger
export const debugFormSubmission = (formElement) => {
  if (!formElement) return;
  
  console.log('🔍 Monitoring form:', formElement);
  
  // Track all form events
  ['submit', 'reset', 'change', 'input'].forEach(eventType => {
    formElement.addEventListener(eventType, (e) => {
      console.log(`📝 Form event: ${eventType}`, {
        defaultPrevented: e.defaultPrevented,
        target: e.target,
        formData: e.target instanceof HTMLFormElement ? 
          Object.fromEntries(new FormData(e.target)) : null
      });
    }, true);
  });
};
