/* eslint-disable no-unused-vars */
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useState } from 'react';
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

const App = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);

  const handleRegisterSuccess = () => {
    setIsRegistered(true); 
  };

  const handleLoginSuccess = (userId) => {
    setIsLogedIn(true);
    localStorage.setItem("userId", userId); 
    socket.connect(); 
    socket.emit("register", userId); 
  };
  
  return (
    <Router>
      <Routes>
        {/* تسجيل المستخدم */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/login" element={<Login onLoginSuccess={(token) => console.log("Logged in:", token)} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* لوحة التحكم */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />


        {/* إدارة المجموعات */}
        <Route path="/create-group" element={<GroupManagementPage />} />
        <Route path="/view-groups" element={<ViewGroupsPage />} />
        <Route path="/manage-file" element={<ManageFilePage />} />
        <Route path="/files-archive" element={<FilesArchivePage />} />
        <Route path="/view-users" element={<ViewUsersPage />} />
        <Route path="/invitation" element={<ViewInvitationsPage />} />
        <Route path="/send-invitation" element={<SendInvitationPage />} />



       
      
      </Routes>
    </Router>
  );
};

export default App;


  /*
    {isRegistered ? (
      <Login onLoginSuccess={(token) => console.log("Logged in:", token)} />
    ) : (
      <Register onRegisterSuccess={handleRegisterSuccess} />
    )}
      */

  /*  <AuthProvider>
      <Router>
        <Routes>
              <Route element={<MainLayout />}>

          <Route element={<MainLayout />}>
            <Route path="/" element={<FileManagement />} />
            <Route path="/files" element={<FileExplorer />} />
            <Route path="/user-groups" element={<GroupFileManagement />} />
            <Route path="/file-archive" element={<FileArchive />} />
          </Route>

          <Route element={<SimpleLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-group" element={<CreateGroup />} />
          </Route>
             </Route>
        </Routes>
      </Router>
    </AuthProvider>
    
  );
};

export default App;
*/