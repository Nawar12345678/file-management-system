/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { loginUser } from "../services/api";
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

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(credentials);
      console.log("Login successful:", response);
      localStorage.setItem("token", response.token); 
      navigate("/user-dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledBox>
      <StyledForm>
        <Typography variant="h5" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          color="textSecondary"
        >
          Sign in to continue
        </Typography>
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={credentials.password}
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
          onClick={handleLogin}
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </StyledForm>
    </StyledBox>
  );
};

export default Login;
