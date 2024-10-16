// React Stuff
import React, { useState, useEffect } from "react"; // Import necessary hooks from React
import axios from "axios"; // Import Axios for making HTTP requests
import { useNavigate, Link, useLocation } from "react-router-dom"; // Import routing hooks

// Images
import Logo from "../../images/itopslogo.png"; // Import the logo image

// MUI Components
import TextField from "@mui/material/TextField"; // Import Material-UI's TextField component
import Button from "@mui/material/Button"; // Import Material-UI's Button component
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
    fontSize: "16px", // Adjust the font size for the input text
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

// Login form component
const Login = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to get the current location

  // Effect to clear the access token if the user is on the login page
  useEffect(() => {
    if (location.pathname === "/login") {
      localStorage.removeItem("accessToken"); // Clear access token from localStorage
    }
  }, [location]); // Run effect when the location changes

  // State for form fields
  const [formData, setFormData] = useState({
    email: "", // Email field
    password: "", // Password field
  });

  // State for error messages
  const [errors, setErrors] = useState({}); // Object to store validation errors
  const [msg, setMsg] = useState(""); // State for success or error messages

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target; // Destructure id and value from the input event
    setFormData({
      ...formData, // Spread existing formData
      [id]: value, // Update the specific field with the new value
    });
  };

  // Validate input fields
  const validate = () => {
    let tempErrors = {}; // Object to collect errors

    // Check if email is provided and valid
    if (!formData.email) tempErrors.email = "Email is required"; // Error if email is empty
    else if (!/\S+@\S+\.\S+/.test(formData.email)) // Regex check for email format
      tempErrors.email = "Email is not valid";
      
    // Check if password is provided
    if (!formData.password) tempErrors.password = "Password is required"; // Error if password is empty

    setErrors(tempErrors); // Update errors state
    return Object.keys(tempErrors).length === 0; // Return true if there are no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (validate()) { // Validate the form before submission
      try {
        // Make a POST request to the login endpoint with form data
        const response = await axios.post(
          "http://localhost:5000/login",
          formData
        );

        const { accessToken, userId, fullname, designation} = response.data; // Destructure accessToken and userId from response
        if (accessToken) { // Check if accessToken exists
          localStorage.setItem("accessToken", accessToken); // Store accessToken in localStorage
          localStorage.setItem("userId", userId); // Store userId in localStorage
          localStorage.setItem("fullname", fullname); // Store userId in localStorage
          localStorage.setItem("designation", designation); // Store userId in localStorage
          navigate("/dashboard"); // Redirect to the dashboard
        }
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg); // Set error message from the response
        } else {
          console.log(error); // Log complete error object for debugging
        }
      }
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen"> {/* Full height section with flexbox */}
      <div
        className="md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Logo})` }} // Set background image to the logo
      />
      <div className="md:w-1/2 w-full bg-[#222426] flex items-center justify-center py-8 md:py-0"> {/* Login form container */}
        <div className="bg-[#333333] p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md"> {/* Form card */}
          <h1 className="text-2xl text-white mb-6 text-center"> {/* Heading */}
            Login to your account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}> {/* Form with vertical spacing */}
            <CustomTextField
              fullWidth
              id="email" // Unique identifier for the email input
              label="Email*" // Label for the email input
              value={formData.email} // Controlled input value
              onChange={handleChange} // Change handler
              error={!!errors.email} // Show error state if there are errors
              helperText={errors.email} // Display error message
            />

            <CustomTextField
              fullWidth
              id="password" // Unique identifier for the password input
              label="Password*" // Label for the password input
              type="password" // Set input type to password
              value={formData.password} // Controlled input value
              onChange={handleChange} // Change handler
              error={!!errors.password} // Show error state if there are errors
              helperText={errors.password} // Display error message
            />

            <Button
              type="submit" // Submit button
              variant="contained" // Material-UI button variant
              fullWidth // Full width button
              sx={{
                backgroundColor: "#7A2424", // Background color
                "&:hover": {
                  backgroundColor: "#942626", // Hover background color
                },
              }}
            >
              Login 
            </Button>
            <div className="text-sm text-gray-400 mt-6 text-center"> {/* Registration prompt */}
              Don't have an account?{" "}
              <Link to="/register" className="text-white hover:underline"> {/* Link to the registration page */}
                Register here
              </Link>
            </div>
          </form>
          {msg && <div className="text-red-500 text-center mt-4">{msg}</div>} {/* Display error or success message */}
        </div>
      </div>
    </section>
  );
};

export default Login; // Export the Login component for use in other parts of the application