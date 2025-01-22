/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userToken = localStorage.getItem("userId"); 
  const adminToken = localStorage.getItem("adminToken");

  return userToken || adminToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
