/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import  { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
}));

const StyledForm = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
}));

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await registerUser(formData);
  
      console.log("Registration successful:", response);
      setLoading(false);
  
      onRegisterSuccess();
      navigate("/login");
    } catch (err) {
      setLoading(false);
        setError(err.message || "Registration failed. Please try again.");
    }
  };
  




  return (
    <StyledBox>
      <StyledForm>
        <Typography variant="h5" gutterBottom align="center">
          Create an Account
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          color="textSecondary"
        >
          Sign up to get started
        </Typography>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleInputChange}
        />
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      {/*  <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 2, cursor: "pointer", color: "blue" }}
          onClick={onRegisterSuccess}
          */}
          <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 2, cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/login")}
        >
          Already have an account? Sign in
        </Typography>
      </StyledForm>
    </StyledBox>
  );
};

export default Register;
