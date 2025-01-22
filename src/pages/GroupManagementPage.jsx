/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { createGroup, addFile, getFilesForGroup, deleteFile, downloadFile } from "../services/api";
import DarkModeSwitch from "./DarkModeSwitch";

const GroupManagementPage = ({isDarkMode, toggleDarkMode}) => {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(null); 
  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fileInput, setFileInput] = useState(null); 
  const [useRandomData, setUseRandomData] = useState(false); 

  useEffect(() => {
    const checkAPIAvailable = async () => {
      try {
        const response = await fetch("/api/check-availability");
        if (response.ok) {
          setUseRandomData(false); 
        } else {
          setUseRandomData(true); 
        }
      } catch (error) {
        setUseRandomData(true);
      }
    };

    checkAPIAvailable();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name!");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing. Please log in.");
    }
   
    setLoading(true);
    try {
      if (useRandomData) {
        setGroupId(Math.floor(Math.random() * 1000));
        alert("Group created");
      } else {
        const result = await createGroup({ name: groupName });
        setGroupId(result.group.id);
        alert("Group created successfully!");
      }
    } catch (error) {
      alert(error.message || "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleAddFile = async () => {
    if (!fileInput || !groupId) return alert("Please select a file and create a group first!");
    setLoading(true);
    try {
      if (useRandomData) {
        const newFile = { id: Math.random(), name: fileInput.name || "random-file.txt" };
        setFiles((prevFiles) => [...prevFiles, newFile]);
        alert("File adde");
      } else {
        const result = await addFile({ name: fileInput.name, groupId, file: fileInput });
        alert("File added successfully!");
        fetchFiles(); 
      }
    } catch (error) {
      alert(error.message || "Failed to add file.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      if (useRandomData) {
        setFiles([
          { id: Math.random(), name: "random-file-1.txt" },
          { id: Math.random(), name: "random-file-2.txt" },
        ]);
        alert("Fetched  files!");
      } else {
        const result = await getFilesForGroup(groupId);
        setFiles(result.files);
      }
    } catch (error) {
      alert(error.message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    setLoading(true);
    try {
      if (useRandomData) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        alert("File deleted");
      } else {
        await deleteFile(fileId);
        alert("File deleted successfully!");
        fetchFiles();
              }
    } catch (error) {
      alert(error.message || "Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId) => {
    if (useRandomData) {
      alert("Download file ");
    } else {
      const result = await downloadFile(fileId);
      if (!result.success) alert(result.error || "Failed to download file.");
    }
  };

  return (
    <Box p={3}  backgroundColor= {isDarkMode ? '#8796A5': '#ffff'} >
       <Box display="flex" justifyContent="Left" mb={3}>
       <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode}   />
     </Box>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1e3c72",
          textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        Group Management
      </Typography>

      <Box mb={1}>
        <Button
          variant="contained"
          color="#ffff"
          Width="0.1"
          onClick={() => setUseRandomData(!useRandomData)}
          sx={{ mb: 2 }}
        >
          {useRandomData ? " Real " : " Random "}
        </Button>
      </Box>

      {/* إنشاء المجموعة */}
      <Box mb={4}>
        <TextField
          label="Group Name"
          variant="outlined"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreateGroup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Group"}
        </Button>
      </Box>

      {/* إضافة الملفات */}
      {groupId && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Manage Files for Group ID: {groupId}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                type="file"
                fullWidth
                onChange={(e) => setFileInput(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleAddFile}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Upload File"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* عرض الملفات */}
      {groupId && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1e3c72" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>File Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f8ff" },
                    transition: "background-color 0.3s ease-in-out",
                  }}
                >
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleDownloadFile(file.id)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteFile(file.id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
             ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default GroupManagementPage;



/*
 const handleDeleteFile = async (fileId) => {
    setLoading(true);
    try {
      if (useRandomData) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        alert("File deleted");
      } else {
        await deleteFile(fileId);
        alert("File deleted successfully!");
        fetchFiles();
              }
    } catch (error) {
      alert(error.message || "Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };*/

/*
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { createGroup, addFile, getFilesForGroup, deleteFile, downloadFile } from "../services/api";

const GroupManagementPage = () => {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(null); // ID المجموعة المنشأة
  const [files, setFiles] = useState([]); // الملفات المضافة للمجموعة
  const [loading, setLoading] = useState(false);
  const [fileInput, setFileInput] = useState(null); // الملف المراد تحميله

  // إنشاء مجموعة
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert("Please enter a group name!");
    setLoading(true);
    try {
      const result = await createGroup({ name: groupName });
      setGroupId(result.group.id); // حفظ ID المجموعة المنشأة
      alert("Group created successfully!");
    } catch (error) {
      alert(error.message || "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  // تحميل الملفات
  const handleAddFile = async () => {
    if (!fileInput || !groupId) return alert("Please select a file and create a group first!");
    setLoading(true);
    try {
      const result = await addFile({ name: fileInput.name, groupId, file: fileInput });
      alert("File added successfully!");
      fetchFiles(); // تحديث قائمة الملفات
    } catch (error) {
      alert(error.message || "Failed to add file.");
    } finally {
      setLoading(false);
    }
  };

  // جلب الملفات للمجموعة
  const fetchFiles = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const result = await getFilesForGroup(groupId);
      setFiles(result.files);
    } catch (error) {
      alert(error.message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  // حذف ملف
  const handleDeleteFile = async (fileId) => {
    setLoading(true);
    try {
      await deleteFile(fileId);
      alert("File deleted successfully!");
      fetchFiles(); // تحديث قائمة الملفات
    } catch (error) {
      alert(error.message || "Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };

  // تنزيل ملف
  const handleDownloadFile = async (fileId) => {
    const result = await downloadFile(fileId);
    if (!result.success) alert(result.error || "Failed to download file.");
  };

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1e3c72",
          textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        Group Management
      </Typography>

   //    إنشاء المجموعة 
      <Box mb={4}>
        <TextField
          label="Group Name"
          variant="outlined"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreateGroup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Group"}
        </Button>
      </Box>

      //إضافة الملفات 
      {groupId && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Manage Files for Group ID: {groupId}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                type="file"
                fullWidth
                onChange={(e) => setFileInput(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleAddFile}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Upload File"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      // عرض الملفات 
      {groupId && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1e3c72" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>File Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f8ff" },
                    transition: "background-color 0.3s ease-in-out",
                  }}
                >
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleDownloadFile(file.id)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteFile(file.id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default GroupManagementPage;
*/