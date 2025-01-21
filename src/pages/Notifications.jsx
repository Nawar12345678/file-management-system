import  React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../services/socket";
import { List, ListItem, ListItemText, Typography, Box, Divider } from "@mui/material";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    socket.on("fileModified", (data) => {
      toast.info(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message: data.message, modifiedBy: data.modifiedBy },
    ]);
  });
  
    return () => {
      socket.off("fileModified");
    };
  }, []);

  return (
    <Box 
      sx={{
        maxWidth: 400,
        margin: "20px auto",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography 
        variant="h5" 
        align="center" 
        gutterBottom 
        sx={{ fontWeight: "bold", color: "#3f51b5" }}
      >
        Notifications
      </Typography>
      <List>
        {notifications.map((notification, index) => (
          <React.Fragment key={index}>
            <ListItem 
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "5px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                marginBottom: "10px",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: "#777" }}>
                    Modified By: {notification.modifiedBy}
                  </Typography>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
