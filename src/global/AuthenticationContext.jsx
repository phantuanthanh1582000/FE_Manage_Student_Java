import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ THÊM loading

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userInfo = localStorage.getItem('user_info');

    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }

    setLoading(false); // ✅ Đảm bảo kết thúc loading
  }, []);

  const onLogin = (data) => {
    const { accessToken, user } = data;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user_info', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const onLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
