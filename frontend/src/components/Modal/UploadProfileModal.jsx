import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const UploadProfileModal = ({
  isOpen,
  onClose,
  onConfirm,
  handleFileChange,
  originalImage,
}) => {
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
      <div className="flex justify-center mb-4 p-10">
        {imageFile ? ( // If an image is uploaded, display it; otherwise, show a default image
          <img
            src={imageFile}
            alt="User Avatar"
            className="rounded-full border-2 border-primary w-25 h-25	"
          />
        ) : (
          <img
            src="https://openui.fly.dev/openui/100x100.svg?text=👤"
            alt="Default Avatar"
            className="rounded-full border-2 border-primary w-25 h-25 "
          />
        )}
      </div>
      <DialogTitle
        sx={{
          fontSize: "18",
          fontFamily: "poppins",
        }}
      >
        Upload Profile Picture
      </DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }} // Hide the file input
          id="file-upload" // Give it an ID for accessibility
        />
        <label htmlFor="file-upload">
          {" "}
          {/* Use label to trigger file input */}
          <Button
            variant="contained" // Material-UI button variant
            component="span" // Make it behave like a button
            sx={{
              padding: "10px 20px", // Button padding
              backgroundColor: "#252525", // Background color
              border: "1px solid #2F6A2A", // Border color
              color: "white", // Text color
              "&:hover": {
                backgroundColor: "#5C7E59", // Hover background color
              },
            }}
          >
            Upload Image
          </Button>
        </label>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleCancel}
          color="secondary"
          sx={{
            borderRadius: "50px", // Border radius
            border: "1px solid #A0A0A0", // Border with specified color
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
          color="primary"
          sx={{
            borderRadius: "50px", // Border radius
            padding: "7px 22px", // Padding for the button
            color: "white", // Text color to match the border color
            background: "#5C7E59",
            "&:hover": {
              backgroundColor: "rgba(92, 126, 89, 0.30)", // Background color with 13% opacity
              color: "#5C7E59",
            },
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadProfileModal;
