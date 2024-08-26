// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
const PrivateRoute = ({ children, role }) => {
  // const { auth } = useAuth();
  // console.log("PrivateRoute called ")
  // console.log(auth);
  const token = Cookies.get('access_token')
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  if (!token) {
    console.log("Unauthorized")
    return <Navigate to="/" />;
  }

  if (userRole !== role) {
    console.log("Role did not matched")
    console.log(role)
    console.log(userRole)
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
