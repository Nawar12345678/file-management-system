/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import { getUsers, searchUser, getUsersForGroup, getReportsForUser } from "../services/api";
import { useLocation } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";

const ViewUsersPage = ({ token, isDarkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { groupId } = location.state || {};

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportLoading, setReportLoading] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let result;
        if (groupId) {
          result = await getUsersForGroup(token, groupId);
        } else {
          result = await getUsers();
        }

        setAllUsers(result.users || []);
        setFilteredUsers(result.users || []);
      } catch (error) {
        console.error("Error fetching users:", error.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [groupId, token]);

  // Handle user search
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
      return;
    }

    setLoading(true);
    try {
      const result = await searchUser({ query: searchQuery });
      const searchedUsers = result.users || [];

      const filteredResults = groupId
        ? searchedUsers.filter((user) =>
            allUsers.some((groupUser) => groupUser.id === user.id)
          )
        : searchedUsers;

      setFilteredUsers(filteredResults);
    } catch (error) {
      console.error("Error searching for users:", error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching report for a user
  const handleReportRequest = async (userId) => {
    setReportLoading((prev) => ({ ...prev, [userId]: true })); 
    try {
      const result = await getReportsForUser(groupId, userId);
      if (result.success) {
        alert(`Reports fetched for user ${userId}: ${JSON.stringify(result.reports)}`);
      } else {
        alert(`Failed to fetch reports for user ${userId}: ${result.error}`);
      }
    } catch (error) {
      alert(`Error fetching reports for user ${userId}: ${error.message}`);
    } finally {
      setReportLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Box p={4} backgroundColor= {isDarkMode ? '#8796A5': '#ffff'}>
    <Box display="flex" justifyContent="Left" mb={3}>
    <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode}   />
  </Box>     
   <Typography variant="h4" align="center" gutterBottom>
        {groupId ? `Users in Group: ${groupId}` : "View Users"}
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}

      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: "500px", mr: 2 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#1e3c72" }}>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>User Name</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                onClick={() => handleReportRequest(user.id)}
                disabled={reportLoading[user.id]} 
              >
                {reportLoading[user.id] ? "Loading..." : "Report"}
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <Typography variant="body2" color="textSecondary">
              No users found. Please ensure the group has users or modify your search.
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
    </Box>
  );
};

export default ViewUsersPage;
