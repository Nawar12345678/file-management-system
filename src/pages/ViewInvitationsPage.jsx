/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { getInvitationsForUser, acceptInvitation } from "../services/api";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import DarkModeSwitch from "./DarkModeSwitch";

const ViewInvitationsPage = ( { isDarkMode, toggleDarkMode } ) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await getInvitationsForUser();
        setInvitations(result || []);
      } catch (error) {
        setErrorMessage(
          error.message || "Something went wrong while fetching invitations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAcceptInvitation = async (invitationId) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await acceptInvitation(invitationId);
      setSuccessMessage(result.message || "Invitation accepted successfully!");
      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Something went wrong while accepting the invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} backgroundColor= {isDarkMode ? '#8796A5': '#ffff'}>
    <Box display="flex" justifyContent="Left" mb={3}>
    <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode}   />
  </Box>   
    <Typography variant="h4" align="center" gutterBottom>
        My Invitations
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}

      {errorMessage && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {successMessage && (
        <Typography color="primary" align="center" sx={{ mb: 2 }}>
          {successMessage}
        </Typography>
      )}

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1e3c72" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Group Name</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sender</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.groupName}</TableCell>
              <TableCell>{invitation.senderName}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAcceptInvitation(invitation.id)}
                >
                  Accept
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {invitations.length === 0 && !loading && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
          No invitations available.
        </Typography>
      )}
    </Box>
  );
};

export default ViewInvitationsPage;
