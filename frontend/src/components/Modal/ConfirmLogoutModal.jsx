import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="confirm-logout-title">
      {/* Title of the modal */}
      <DialogTitle id="confirm-logout-title">Confirm Logout</DialogTitle>

      {/* Modal content */}
      <DialogContent>
        <Typography>Are you sure you want to log out?</Typography>
      </DialogContent>

      {/* Action buttons */}
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLogoutModal;
