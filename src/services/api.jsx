import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  }, (error) => {
    if (error.response && error.response.status === 401) {
        console.error('Unauthorized! Redirecting to login.');
      }
      return Promise.reject(error.response ? error.response.data : { message: 'An error occurred!' });
    }
  );

// Register API Call*
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Something went wrong!' };
  }
};

// Login API Call*
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return response.data; // Expecting user data and token
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Something went wrong!' };
  }
};

// Create Group API Call*
export const createGroup = async (groupData) => {
  try {
    const response = await API.post('/group/create', groupData);
    return response.data; // Expecting the newly created group data
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Something went wrong while creating group!' };
  }
};
// Get Groups for User API Call*
export const getGroupsForUser = async () => {
  try {
    const response = await API.get('/group/user');
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Something went wrong while fetching groups!' };
  }
};
// Send Invitation API Call*
export const sendInvitation = async (groupId, userId) => {
    try {
      const response = await API.post(`/invitation/send?groupId=${groupId}`, { userId });
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while sending invitation!' };
    }
  };
  // Get Invitations for User API Call*
export const getInvitationsForUser = async () => {
    try {
      const response = await API.get('/invitation/view');
      return response.data; // Expecting a list of invitations
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while fetching invitations!' };
    }
  };
  // Accept Invitation API Call*
export const acceptInvitation = async (invitationId) => {
    try {
      const response = await API.put(`/invitation/accept/${invitationId}`);
      return response.data; // Expecting a success message
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while accepting invitation!' };
    }
  };
  // Show Users List API*
export const getUsers = async () => {
    try {
      const response = await API.get('/user/get');
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while fetching users!' };
    }
  };
  
  // Search For Selects Users API*
  export const searchUser = async (searchCriteria) => {
    try {
      const response = await API.post('/user/search', searchCriteria);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while searching for users!' };
    }
  };
  // Add File API*
export const addFile = async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('name', fileData.name); 
      formData.append('groupId', fileData.groupId); 
      formData.append('file', fileData.file); 
  
      const response = await API.post('/file/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while adding the file!' };
    }
  };
  // Get File For Group API*
export const getFilesForGroup = async (groupId) => {
    try {
      const response = await API.get(`/file/get`, {
        params: { groupId },
      });
  
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Something went wrong while fetching files!' };
    }
  };
// Download File API*
export const downloadFile = async (fileId) => {
    try {
      const response = await API.get(`/file/download`, {
        params: { fileId },
        responseType: 'blob', 
      });
  
      // Save File In Device API
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `file-${fileId}`); // اسم الملف
      document.body.appendChild(link);
      link.click();
  
      return { success: true };
    } catch (error) {
      console.error('Error downloading file:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  
  // Delete File API *
  export const deleteFile = async (fileId) => {
    try {
      const response = await API.delete(`/file/delete`, {
        params: { fileId },
      });
  
      console.log('File deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  
  // checkOutFile API*
  export const checkOutFile = async (fileId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await API.put(`/file/check-out`, formData, {
        params: { fileId },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log('Check-out successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during check-out:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
// checkInFile  API*
export const checkInFile = async (fileId) => {
    try {
      const response = await API.put(`/file/check-in`, null, {
        params: { fileId },
      });
  
      console.log('Check-in successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during check-in:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  
  // checkInMultipleFiles API
  export const checkInMultipleFiles = async (fileIds) => {
    try {
      const response = await API.put(`/file/check-in-multiple`, {
        files: fileIds,
      });
  
      console.log('Check-in for multiple files successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during check-in for multiple files:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  
  // getFilesNotAccepted API*
  export const getFilesNotAccepted = async (groupId) => {
    try {
      const response = await API.get(`/file/not-accept`, {
        params: { groupId },
      });
  
      console.log('Files not accepted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting files not accepted:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  // Accept File API*
export const acceptFile = async (fileId) => {
    try {
      const response = await API.put(`/file/accept`, null, {
        params: { fileId },
      });
  
      console.log('File accepted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during file acceptance:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  // getReportsForFile API*
export const getReportsForFile = async (fileId) => {
    try {
        const response = await API.get(`/report/file`, {
            params: { fileId },
        });
        console.log('Reports fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports for file:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};
// getReportsForUser API*
export const getReportsForUser = async (groupId, userId) => {
    try {
      const response = await API.get('/report/user', {
        params: { groupId, userId },
      });
      console.log('Reports fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports for user:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };

//getBackupForFile API*
export const getBackupForFile = async (fileId) => {
    try {
        const response = await API.get(`/backup/get`, {
            params: { fileId },
        });
        console.log('Backup fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching backup for file:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

// DownloadBackup API*
export const downloadBackup = async (backupId) => {
    try {
        const response = await API.get(`/backup/download`, {
            params: { backupId },
            responseType: 'blob',
        });

        const link = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;
        link.setAttribute('download', `backup-${backupId}.zip`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Backup downloaded successfully');
    } catch (error) {
        console.error('Error downloading backup:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};


//loginSuperAdmin  API 1
export const loginSuperAdmin = async (email, password) => {
    try {
        const response = await API.post('/admin/login', {
            email,
            password
        });

        if (response.status === 200) {
            console.log('Login successful:', response.data);
            localStorage.setItem('adminToken', response.data.token);
            return { success: true, token: response.data.token };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

//GetGroups API* 2
export const getGroups = async (token) => {
    try {
        const response = await API.get('/admin/groups', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log('Groups retrieved successfully:', response.data.groups);
            return { success: true, groups: response.data.groups };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching groups:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

//getUsersForGroupAdmin API* 3
export const getUsersForGroup = async (token, groupId) => {
    try {
        const response = await API.get('/admin/users-group', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                groupId
            }
        });

        if (response.status === 200) {
            console.log('Users in Group:', response.data.users);
            return { success: true, users: response.data.users };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching users for group:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

//getFilesForGroup API* 4
export const getFilesForGroupadmin = async (token, groupId) => {
    try {
        const response = await API.get('/admin/files-group', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                groupId
            }
        });

        if (response.status === 200) {
            console.log('Files in Group:', response.data.files);
            return { success: true, files: response.data.files };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching files for group:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

//getReportsForUseradmin API 5
export const getReportsForUseradmin = async (token, userId) => {
    try {
        const response = await axios.get('/admin/report-user', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                userId
            }
        });

        if (response.status === 200) {
            console.log('Reports for User:', response.data.reports);
            return { success: true, reports: response.data.reports };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching reports for user:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};
//getGroupsForUseradmin API* 6
export const getGroupsForUseradmin = async (token, userId) => {
    try {
        const response = await axios.get('/admin/groups-user', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                userId
            }
        });

        if (response.status === 200) {
            console.log('Groups for User:', response.data.groups);
            return { success: true, groups: response.data.groups };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching groups for user:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};