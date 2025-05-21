import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  
  const onLogin = (data) => {
  const { accessToken, user } = data;
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('user_info', JSON.stringify(user)); 
  setIsAuthenticated(true);
};

  // Hàm gọi khi logout
  const onLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
