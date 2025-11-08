'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check session storage for auth status
    const authStatus = sessionStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const logout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };
  
  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}

