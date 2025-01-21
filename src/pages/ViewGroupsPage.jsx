/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  getGroups,
  getGroupsForUser,
  getFilesForGroupadmin,
  getUsersForGroup,
  checkOutFile,
  checkInFile,
  getFilesNotAccepted,
  acceptFile,
  getFilesForGroup,
  getReportsForFile,
} from "../services/api";
import { useNavigate } from "react-router-dom";
const ViewGroupsPage = ({ token, userType }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [reportLoading, setReportLoading] = useState({});
  const navigate = useNavigate();


  const generateFakeData = () => {
    const fakeGroups = Array.from({ length: 3 }, (_, i) => ({
      id: `group-${i + 1}`,
      name: `Group ${i + 1}`,
    }));

    const fakeFiles = Array.from({ length: 5 }, (_, i) => ({
      id: `file-${i + 1}`,
      name: `File ${i + 1}.txt`,
      status: i % 2 === 0 ? "Check-In" : "Check-Out",
    }));

    const fakeUsers = Array.from({ length: 3 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
    }));

    return { fakeGroups, fakeFiles, fakeUsers };
  };

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        let groupsData;

        if (userType === "admin") {
          const result = await getGroups(token);
          if (result.success) {
            groupsData = result.groups;
          } else {
            throw new Error(result.message || "Failed to fetch groups for admin.");
          }
        } else {
          groupsData = await getGroupsForUser();
        }

        setGroups(groupsData || []);
      } catch (error) {
        console.error(error.message || "Error fetching groups.");
        const { fakeGroups } = generateFakeData();
        setGroups(fakeGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token, userType]);
  

  const handleReportFile = async (fileId) => {
    setReportLoading((prev) => ({ ...prev, [fileId]: true }));
    try {
      const reportData = await getReportsForFile(fileId);
      if (reportData.success) {
        alert(`Report fetched successfully for file ID: ${fileId}`);
        console.log("Report Data:", reportData);
      } else {
        alert(`Failed to fetch report for file ID: ${fileId}`);
      }
    } catch (error) {
      alert("Error fetching report for file.");
      console.error(error);
    } finally {
      setReportLoading((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  const handleAcceptFile = async (fileId) => {
    setLoading(true); 
    try {
      const result = await acceptFile(fileId); 
      if (result.success) {
        alert("File accepted successfully!"); 
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        );
      } else {
        alert("Failed to accept the file."); 
      }
    } catch (error) {
      alert("Error during file acceptance.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckInFile = async (fileId) => {
    setLoading(true);
    try {
      const result = await checkInFile(fileId); 
      if (result.success) {
        alert("File checked in successfully!");
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, status: "Check-In" } : file
          )
        ); 
      } else {
        alert("Failed to check in the file."); 
      }
    } catch (error) {
      alert("Error while checking in the file.");
    } finally {
      setLoading(false); 
    }
  };

  const handleCheckOutFile = async (fileId) => {
    setLoading(true); 
    try {
      const result = await checkOutFile(fileId); 
      if (result.success) {
        alert("File checked out successfully!");
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, status: "Check-Out" } : file
          )
        ); 
      } else {
        alert("Failed to check out the file.");
      }
    } catch (error) {
      alert("Error while checking out the file.");
    } finally {
      setLoading(false); 
    }
  };
  
  
  const handleGroupClick = async (group, mode) => {
    setSelectedGroup(group);
    setDialogMode(mode);
    setDialogOpen(true);
    setLoading(true);

    try {
      if (mode === "details") {
        if (userType === "admin") {
          const [filesResult, notAcceptedResult] = await Promise.all([
            getFilesForGroupadmin(token, group.id),
            getFilesNotAccepted(group.id),
          ]);

          const allFiles = filesResult.success
            ? filesResult.files.map((file) => ({
                ...file,
                status: file.isCheckedOut ? "Check-Out" : "Check-In",
              }))
            : [];

          const notAcceptedFiles = notAcceptedResult.success
            ? notAcceptedResult.files.map((file) => ({
                ...file,
                status: "Not Accepted",
              }))
            : [];

          setFiles([...allFiles, ...notAcceptedFiles]);
        } else {
          const filesResult = await getFilesForGroup(group.id);
          setFiles(
            filesResult.map((file) => ({
              ...file,
              status: "Available",
            }))
          );
        }
      } else if (mode === "users") {
        const usersResult = await getUsersForGroup(token, group.id);
        setUsers(usersResult.success ? usersResult.users : []);
      }
    } catch (error) {
      console.error(`Error fetching ${mode}:`, error.message || error);
      const { fakeFiles, fakeUsers } = generateFakeData();
      if (mode === "details") {
        setFiles(fakeFiles);
      } else if (mode === "users") {
        setUsers(fakeUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        View Groups
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent>
              <Typography variant="h6">{group.name}</Typography>
              <Typography>ID: {group.id}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => handleGroupClick(group, "details")}>View Details</Button>
              <Button onClick={() => navigate("/view-users", { state: { groupId: group.id } })}>View Users</Button>
              <Button onClick={() => navigate("/invitation", { state: { groupId: group.id } })}>View Invitation</Button>



            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {dialogMode === "details"
          ? `Group Details: ${selectedGroup?.name}`
          : `Users in Group: ${selectedGroup?.name}`}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : dialogMode === "details" ? (
          <>
            <Typography variant="h6">Files:</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1e3c72" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>File Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>File ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Report</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.id}</TableCell>
                      <TableCell>{file.status}</TableCell>
                      <TableCell>
                        {file.status === "Check-In" && (
                          <Button onClick={() => handleCheckOutFile(file.id)}>Check Out</Button>
                        )}
                        {file.status === "Check-Out" && (
                          <Button onClick={() => handleCheckInFile(file.id)}>Check In</Button>
                        )}
                        {file.status === "Not Accepted" && (
                          <Button onClick={() => handleAcceptFile(file.id)}>Accept</Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleReportFile(file.id)}
                          disabled={reportLoading[file.id]}
                        >
                          {reportLoading[file.id] ? <CircularProgress size={20} /> : "Report"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
          ) : (
            <>
              <TextField
                label="Search User"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>User ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewGroupsPage;
