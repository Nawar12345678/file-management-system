/* eslint-disable no-unused-vars */
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

 const DarkModeSwitch = styled(Switch)(({ theme }) => ({
    width: 50,
    height: 26,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(24px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#4caf50',
          opacity: 1,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      width: 22,
      height: 22,
      boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
    },
    '& .MuiSwitch-track': {
      borderRadius: 13,
      backgroundColor: '#d8d8d8',
      opacity: 1,
    },
  }));export default DarkModeSwitch;