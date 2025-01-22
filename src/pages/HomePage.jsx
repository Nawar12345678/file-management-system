/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, Typography, Grid, Paper, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DarkModeSwitch from './DarkModeSwitch';

const HomePage = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/register');  
  };

  const handleAdminClick = () => {
    navigate('/admin/login');  
  };


  return (
    <>
  
      
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{   backgroundColor:isDarkMode ? '#8796A5' :  '#f0f8ff' }}
    >
       
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
            backgroundColor:'#ffffff',
          }}
        >
           <Box display="flex" justifyContent="Left" mb={3}>
            <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode}   />
          </Box>

          
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#1e3c72',
              marginBottom: 3,
              textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
            }}
          >
            Please Choose Your Role
          </Typography>

         

          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUserClick}
                sx={{
                  width: '150px',
                  height: '50px',
                  fontSize: '16px',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease-in-out',
                    backgroundColor: '#3b5998',
                  },
                }}
              >
                User
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAdminClick}
                sx={{
                  width: '150px',
                  height: '50px',
                  fontSize: '16px',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease-in-out',
                    backgroundColor: '#d32f2f',
                  },
                }}
              >
                Admin
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      </>
  );
};

export default HomePage;
