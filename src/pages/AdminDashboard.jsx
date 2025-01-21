/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #4a90e2 0%, #9013fe 100%)",
  minHeight: "100vh",
  padding: theme.spacing(4),
  color: "#fff",
}));

const AdminDashboard = () => {
  const navigate = useNavigate(); 

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom align="center">
        Admin Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center" mt={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/create-group")} 
            sx={{
              padding: 2,
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3, #21CBF3)",
            }}
          >
            Create Group
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => navigate("/view-groups")} 
            sx={{
              padding: 2,
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
            }}
          >
            View Groups
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/manage-file")} 
            sx={{
              padding: 2,
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3, #21CBF3)",
            }}
          >
            Manage File
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={() => navigate("/files-archive")}
            sx={{
              padding: 2,
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #FF9800, #FFC107)",
            }}
          >
            Files Archive
          </Button>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default AdminDashboard;
