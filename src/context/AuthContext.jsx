// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    console.log("Inside the AuthProvider")
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuth({
          token,
          role: decodedToken.role,
        });
        console.log(auth)
      } catch (error) {
        console.error('Invalid token:', error);
        Cookies.remove('access_token');
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setAuth({
        token,
        role: decodedToken.role,
      });
      Cookies.set('access_token', token, { expires: 7 });
      Cookies.set('userId',decodedToken.id, {expires:7});
    } catch (error) {
      console.error('Invalid token:', error);
    }
  };

  const logout = () => {
    setAuth(null);
    Cookies.remove('access_token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
