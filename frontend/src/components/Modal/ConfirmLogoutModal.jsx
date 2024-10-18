import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="confirm-logout-title"
    >
      {/* Title of the modal */}
      <DialogTitle
        id="confirm-logout-title"
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Confirm Logout
      </DialogTitle>

      {/* Modal content */}
      <DialogContent sx={{ fontFamily: "Poppins, sans-serif" }}>
        <Typography>Are you sure you want to log out?</Typography>
      </DialogContent>

      {/* Action buttons */}
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{
            borderRadius: "50px", // Border radius
            border: "1px solid #A0A0A0",// Border with specified color
            padding: "7px 22px", // Padding for the button
            color: "#333333", // Text color to match the border color
            background: "white",
            "&:hover": {
              backgroundColor: "rgba(160, 160, 160, 0.13)", // Background color with 13% opacity
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            borderRadius: "50px", // Border radius
            padding: "7px 22px", // Padding for the button
            color: "#333333", // Text color to match the border color
            background: "white",
            "&:hover": {
              backgroundColor: "rgba(122, 28, 37, 0.13)", // Background color with 13% opacity
              color: "#7A1C25",
            },
          }}
        >
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
