import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error('Auth init error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerApi(userData);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
