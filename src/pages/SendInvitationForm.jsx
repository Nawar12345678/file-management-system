import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendInvitation } from "../services/api";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";

const SendInvitationPage = () => {
  const [groupId, setGroupId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); 

  const handleSendInvitation = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await sendInvitation(groupId, userId);
      setSuccessMessage(result.message || "Invitation sent successfully!");
      navigate("/invitation");
    } catch (error) {
      setErrorMessage(
        error.message || "Something went wrong while sending the invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h4" align="center" gutterBottom>
        Send Invitation
      </Typography>

      <TextField
        label="Group ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />

      <TextField
        label="User ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !groupId || !userId}
        onClick={handleSendInvitation}
      >
        {loading ? <CircularProgress size={24} /> : "Send Invitation"}
      </Button>

      {successMessage && (
        <Typography color="green" align="center" mt={2}>
          {successMessage}
        </Typography>
      )}

      {errorMessage && (
        <Typography color="red" align="center" mt={2}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default SendInvitationPage;
