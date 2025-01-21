/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import { getFilesForGroupadmin, getFilesForGroup, getUsersForGroup } from "../services/api";

const FilesArchivePage = ({ token, groupId, userType }) => {
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateFakeData = () => {
    const fakeFiles = Array.from({ length: 5 }, (_, index) => ({
      id: `file-${index + 1}`,
      name: `File ${index + 1}.txt`,
      checkedOutBy: index % 2 === 0 ? `User ${index + 1}` : null,
      checkOutTime: index % 2 === 0 ? `2025-01-0${index + 1} 10:00` : null,
      checkInTime: index % 2 === 0 ? `2025-01-0${index + 2} 15:00` : null,
    }));

    const fakeUsers = Array.from({ length: 4 }, (_, index) => ({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      reservedFiles:
        index % 2 === 0
          ? [`File ${index + 1}.txt`, `File ${index + 3}.txt`]
          : [],
    }));

    return { fakeFiles, fakeUsers };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (token) {
          let filesResult;
          let usersResult = { success: false, users: [] };

          if (userType === "admin") {
            [filesResult, usersResult] = await Promise.all([
              getFilesForGroupadmin(token, groupId),
              getUsersForGroup(token, groupId),
            ]);
          } else {
            filesResult = await getFilesForGroup(groupId);
          }

          setFiles(filesResult.success ? filesResult.files : []);
          setUsers(usersResult.success ? usersResult.users : []);
        } else {
          const { fakeFiles, fakeUsers } = generateFakeData();
          setFiles(fakeFiles);
          setUsers(fakeUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        const { fakeFiles, fakeUsers } = generateFakeData();
        setFiles(fakeFiles);
        setUsers(fakeUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, groupId, userType]);

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
          mb: 2,
        }}
      >
        Files Archive
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}

      {/* Table for Files */}
      <Typography variant="h6" gutterBottom>
        Files Details:
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1e3c72" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>File Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Checked-Out By</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check-Out Time</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Check-In Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.checkedOutBy || "N/A"}</TableCell>
                <TableCell>{file.checkOutTime || "N/A"}</TableCell>
                <TableCell>{file.checkInTime || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table for Users */}
      {userType === "admin" && (
        <>
          <Typography variant="h6" gutterBottom>
            Users and Their Reserved Files:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e3c72" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>User Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Reserved Files</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} sx={{ backgroundColor: "#1e3c72" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {user.reservedFiles && user.reservedFiles.length > 0
                        ? user.reservedFiles.join(", ")
                        : "No files reserved"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default FilesArchivePage;
