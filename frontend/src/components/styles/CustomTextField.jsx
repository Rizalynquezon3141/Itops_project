// MUI Components
import TextField from "@mui/material/TextField"; // Import Material-UI's TextField component
import { styled } from "@mui/material/styles"; // Import styled utility from Material-UI

 // Styles for the input fields
 const CustomTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "gray", // Border color for the input field
      },
      "&:hover fieldset": {
        borderColor: "white", // Border color on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "gray", // Border color when the input field is focused
      },
      backgroundColor: "transparent", // Make the input background transparent
    },
    "& .MuiInputLabel-root": {
      color: "gray", // Label color
      fontFamily: "'Poppins', sans-serif", // Set the font of the label
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white", // Change label color when focused
      fontFamily: "'Poppins', sans-serif", // Set the font of the focused label
    },
    "& .MuiOutlinedInput-input": {
      color: "white", // Text color inside the input field
      backgroundColor: "transparent", // Ensure input text background is transparent
      fontFamily: "'Poppins', sans-serif", // Set the font for the input text
      fontSize: "12px", // Adjust the font size for the input text
    },
    // Handle autofill background for Chrome, Safari, and other WebKit browsers
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #333333 inset", // Inset shadow for autofilled input
      WebkitTextFillColor: "white", // Text color inside autofilled inputs
      transition: "background-color 5000s ease-in-out 0s", // Delay the background-color reset
      fontFamily: "'Poppins', sans-serif", // Ensure autofilled text uses Poppins font
      fontSize: "16px", // Ensure autofilled input text uses the same font size
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0 1000px #333333 inset", // Ensure the same background when focused
      WebkitTextFillColor: "white", // Keep text white when autofilled and focused
      fontFamily: "'Poppins', sans-serif", // Ensure autofilled text uses Poppins font
      fontSize: "16px", // Keep the font size for autofilled inputs
    },
  }));