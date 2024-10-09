// React Stuff
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Images
import Logo from "../../images/itopslogo.png";

// MUI Components
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// Styles for the input fields
const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray", // Border color
    },
    "&:hover fieldset": {
      borderColor: "white", // Border color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray", // Border color when focused
    },
    backgroundColor: "transparent", // Input background color should remain transparent
  },
  "& .MuiInputLabel-root": {
    color: "gray", // Label color
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font to the label
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // Label color when focused
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font to the focused label
  },
  "& .MuiOutlinedInput-input": {
    color: "white", // Text color
    backgroundColor: "transparent", // Ensure input text background is transparent
    fontFamily: "'Poppins', sans-serif", // Set Poppins font for the input text
    fontSize: "16px", // Adjust the font size for the input text
  },
  // Handle autofill background for Chrome, Safari, and other WebKit browsers
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px #333333 inset", // Inset shadow to force background color
    WebkitTextFillColor: "white", // Text color inside autofilled inputs
    transition: "background-color 5000s ease-in-out 0s", // Delay the background-color reset
    fontFamily: "'Poppins', sans-serif", // Ensure autofilled text also uses Poppins font
    fontSize: "16px", // Ensure autofilled input text also uses the same font size
  },
  "& input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px #333333 inset", // Ensure the same background when focused
    WebkitTextFillColor: "white", // Keep the text white
    fontFamily: "'Poppins', sans-serif", // Ensure autofilled text also uses Poppins font
    fontSize: "16px", // Keep the font size for autofilled inputs
  },
}));

// Login form component
const Login = ({ setUser }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // State for error messages
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Validate inputs
  const validate = () => {
    let tempErrors = {};

    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is not valid";
    if (!formData.password) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/login",
          formData
        );

        const { accessToken, userId } = response.data;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", userId); // Use userId from response
          // Redirect to the user's dashboard using userId
          navigate(`/dashboard/${userId}`); // Corrected this line
        }
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg); // Displaying error message
        } else {
          console.log(error); // Add this to see the complete error object
        }
      }
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen">
      <div
        className="md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Logo})` }} // Fix the URL template literal
      />
      <div className="md:w-1/2 w-full bg-[#222426] flex items-center justify-center py-8 md:py-0">
        <div className="bg-[#333333] p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl text-white mb-6 text-center">
            Login to your account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <CustomTextField
              fullWidth
              id="email"
              label="Email*"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <CustomTextField
              fullWidth
              id="password"
              label="Password*"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#7A2424",
                "&:hover": {
                  backgroundColor: "#942626",
                },
              }}
            >
              Login
            </Button>
            <div className="text-sm text-gray-400 mt-6 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-white hover:underline">
                Register here
              </Link>
            </div>
          </form>
          {msg && <div className="text-red-500 text-center mt-4">{msg}</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;


{
  /*
  Use to render user specific data
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/activities/${userId}`);
        setActivities(response.data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };

    fetchActivities();
  }, [userId]);

  return (
    <div>
      <h1>Your Activities</h1>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>{activity.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;  
  
  
*/
}
