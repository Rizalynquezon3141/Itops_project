import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const UploadProfileModal = ({ isOpen, onClose, onConfirm, handleFileChange, originalImage}) => {
  const [imageFile, setImageFile] = useState(null); // Store the selected file

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result); // Update the local state with the uploaded image
        handleFileChange(reader.result); // Call the parent function to update the profile image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setImageFile(originalImage); // Reset to the original image when canceling
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="flex justify-center mb-4">
        {imageFile ? ( // If an image is uploaded, display it; otherwise, show a default image
          <img
            src={imageFile}
            alt="User Avatar"
            className="rounded-full border-2 border-primary w-24 h-24"
          />
        ) : (
          <img
            src="https://openui.fly.dev/openui/100x100.svg?text=👤"
            alt="Default Avatar"
            className="rounded-full border-2 border-primary w-24 h-24"
          />
        )}
      </div>
      <DialogTitle>Upload Profile Picture</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          fullWidth
          inputProps={{ style: { padding: "8px" } }} // Adjust padding for better appearance
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadProfileModal;
