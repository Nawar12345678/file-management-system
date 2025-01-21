/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  checkOutFile,
  checkInFile,
  getGroupsForUser,
  getFilesForGroup,
  getBackupForFile,
  downloadBackup,
} from "../services/api";

const ManageFilePage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const groupsData = await getGroupsForUser();
        setGroups(groupsData);
      } catch (error) {
        setMessage(error.message || "Failed to fetch groups.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const fetchFilesForGroup = async (groupId) => {
    setLoading(true);
    try {
      const filesData = await getFilesForGroup(groupId);
      setFiles(filesData);
    } catch (error) {
      setMessage(error.message || "Failed to fetch files.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const result = await checkOutFile(selectedFile, file);
      if (result.success) {
        setMessage("File checked out successfully!");
        setMessageType("success");
        fetchBackups(selectedFile); 
      } else {
        setMessage(result.error || "Failed to check out file.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error while checking out file.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const result = await checkInFile(selectedFile);
      if (result.success) {
        setMessage("File checked in successfully!");
        setMessageType("success");
        fetchBackups(selectedFile); 
      } else {
        setMessage(result.error || "Failed to check in file.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error while checking in file.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async (fileId) => {
    setLoading(true);
    try {
      const backupData = await getBackupForFile(fileId);
      console.log("Backup Data:", backupData);
      if (backupData.success) {
        setBackups(backupData.backups || []);
      } else {
        setMessage(backupData.error || "Failed to fetch backups.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error fetching backups.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDownloadBackup = async (backupId) => {
    setLoading(true);
    try {
      await downloadBackup(backupId);
      setMessage("Backup downloaded successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error downloading backup.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1e3c72",
          textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
          mb: 4,
        }}
      >
        Manage Files
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} maxWidth={600} mx="auto">
        <Box>
          <Typography variant="h6">Select Group:</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="group-select-label">Group</InputLabel>
            <Select
              labelId="group-select-label"
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                fetchFilesForGroup(e.target.value);
              }}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="h6">Select File:</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="file-select-label">File</InputLabel>
            <Select
              labelId="file-select-label"
              value={selectedFile}
              onChange={(e) => {
                setSelectedFile(e.target.value);
                fetchBackups(e.target.value);
              }}
              disabled={!selectedGroup || loading}
            >
              {files.map((file) => (
                <MenuItem key={file.id} value={file.id}>
                  {file.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
  <Typography variant="h6">Backups:</Typography>
  {backups.length > 0 ? (
    backups.map((backup) => (
      <Box key={backup.id} display="flex" alignItems="center" gap={2}>
        <Typography>{`Backup ID: ${backup.id}`}</Typography>
        <Button
          variant="outlined"
          onClick={() => handleDownloadBackup(backup.id)}
        >
          Download
        </Button>
      </Box>
    ))
  ) : (
    <Typography>No backups available.</Typography>
  )}
</Box>


        <Box>
          <Button
            variant="outlined"
            component="label"
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckOut}
            disabled={loading || !selectedFile || !file}
            sx={{ ml: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Check Out"}
          </Button>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckIn}
            disabled={loading || !selectedFile}
          >
            {loading ? <CircularProgress size={24} /> : "Check In"}
          </Button>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/files-archive")}
          >
            Go to Archive
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
      >
        <Alert
          onClose={() => setMessage("")}
          severity={messageType}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageFilePage;
