// Debug component to check user authentication and orders
import { useState, useEffect } from 'react';
import authService from '../services/authService';

const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      // Decode JWT token to see what's inside (client-side only)
      let decodedToken = null;
      if (token) {
        try {
          const payload = token.split('.')[1];
          decodedToken = JSON.parse(atob(payload));
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      setDebugInfo({
        hasToken: !!token,
        tokenExists: token ? 'Yes' : 'No',
        user: user,
        decodedToken: decodedToken,
        localStorage: {
          authToken: localStorage.getItem('authToken') ? 'Exists' : 'Not found',
          user: localStorage.getItem('user') ? 'Exists' : 'Not found'
        }
      });
    };

    checkAuth();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Debug Info</h4>
      <div>
        <strong>Token:</strong> {debugInfo.tokenExists}<br/>
        <strong>User Email:</strong> {debugInfo.user?.email || 'None'}<br/>
        <strong>User Name:</strong> {debugInfo.user?.firstName} {debugInfo.user?.lastName}<br/>
        <strong>Token Email:</strong> {debugInfo.decodedToken?.email || 'None'}<br/>
        <strong>Token User ID:</strong> {debugInfo.decodedToken?.userId || 'None'}<br/>
        <strong>LocalStorage Token:</strong> {debugInfo.localStorage?.authToken}<br/>
        <strong>LocalStorage User:</strong> {debugInfo.localStorage?.user}<br/>
      </div>
      <button 
        onClick={() => console.log('Full debug info:', debugInfo)}
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          fontSize: '11px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Log to Console
      </button>
    </div>
  );
};

export default DebugAuth;