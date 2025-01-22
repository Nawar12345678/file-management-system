/* eslint-disable no-unused-vars */
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ViewGroupsPage from './pages/ViewGroupsPage';
import FilesArchivePage from './pages/FilesArchivePage';
import GroupManagementPage from './pages/GroupManagementPage';
import ManageFilePage from './pages/ManageFilePage';
import UserDashboard from './pages/UserDashboard';
import ViewUsersPage from './pages/ViewUsersPage';
import SendInvitationPage from './pages/SendInvitationForm';
import ViewInvitationsPage from './pages/ViewInvitationsPage';
import socket from './services/socket';
import ProtectedRoute from './pages/ProtectedRoute';
import { ThemeProvider, createTheme, Button, Box, Typography, CssBaseline } from "@mui/material";


const App = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);

  const handleRegisterSuccess = () => {
    setIsRegistered(true); 
  };
  

  const handleLoginSuccess = (userId, userToken ) => {
    setIsLogedIn(true);
    localStorage.setItem("userId", userId); 
    localStorage.setItem("token", userToken);
    socket.connect(); 
    socket.emit("register", userId); 
  };


  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

 
  return (
    <ThemeProvider theme={theme}>
 <CssBaseline />
    <Router>
      <Routes>
        {/* تسجيل المستخدم */}
        <Route path="/" element={<HomePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}
          />
         } />
        <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}  />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess}  toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} /> } />
        <Route path="/admin/login" element={<AdminLogin  toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
        
        {/* لوحة التحكم */}
        <Route path="/admin-dashboard" element={<AdminDashboard toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>} />
        <Route path="/user-dashboard" element={<UserDashboard toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}  />} />


        {/* إدارة المجموعات */}
        <Route path="/create-group"
  element={
      <GroupManagementPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}  />
 
  }          />

        <Route path="/view-groups" 
        element={
        <ViewGroupsPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
      }
         />

        <Route path="/manage-file" 
        element={
        <ManageFilePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        } 
        />

        <Route path="/files-archive" 
        element={
        <FilesArchivePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
      }
         />
        <Route path="/view-users"
         element={
         <ViewUsersPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        }
          />
        <Route path="/invitation" 
        element={
        <ViewInvitationsPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      }
         />
        <Route path="/send-invitation"
         element={
         <SendInvitationPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
         } 
         />
       
      
      </Routes>
    </Router>
    </ThemeProvider>

  );
};

export default App;

