//React stuffs
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

//Images
import Logo from "../../images/itopslogo.png";

//MUI Components
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/material/styles";

//Styles for the input fields
const CustomTextField = styled(TextField)({
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
});

//Styles for the Dropdown
const CustomFormControl = styled(FormControl)({
  "& .MuiInputLabel-root": {
    color: "gray", // Default label color
    backgroundColor: "#333333", // Background color for the label
    padding: "0 4px", // Add some padding to make it look nicer
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font to the label
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // Label color when focused
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font to the label
  },
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
  },
  "& .MuiSelect-icon": {
    color: "white", // Dropdown arrow color
  },
  "& .MuiSelect-select": {
    color: "white", // Text color for selected value
    fontFamily: "'Poppins', sans-serif", // Font for the selected value
  },
});

//Registeration form component
function Register() {
  // State for form fields
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    designation: "",
    termsAccepted: false,
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for error messages
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, name, type, checked } = e.target;
    setFormData({
      ...formData,
      [id || name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to validate password strength
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  // Validate inputs
  const validate = () => {
    let tempErrors = {};

    if (!formData.fullname) tempErrors.fullname = "Full Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is not valid";

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      tempErrors.password = passwordErrors.join(" ");
    }

    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    if (!formData.termsAccepted)
      tempErrors.termsAccepted = "You must accept the Terms and Conditions";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/users",
          formData
        );
        navigate("/login"); // Use navigate("/login") if that's the intended route
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg); // Displaying error message
        } else {
          setMsg("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <>
      <section className="flex flex-col md:flex-row h-screen">
        <div
          className="hidden md:block md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Logo})` }}
        />
        <div className="md:w-1/2 w-full bg-[#222426] flex items-center justify-center py-8 md:py-0">
          <div className="bg-[#333333] p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl text-white mb-6 text-center">
              Create an account
            </h1>

            {/* Display backend error message */}
            {msg && (
              <p className="text-red-500 text-center">
                <Alert severity="error" sx={{ mb: 2, textAlign: "center" }}>
                  {msg}
                </Alert>
              </p>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <CustomTextField
                fullWidth
                id="fullname"
                label="Full Name*"
                value={formData.fullname}
                onChange={handleChange}
                error={!!errors.fullname}
                helperText={errors.fullname}
              />

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
                id="contact"
                label="Contact number * "
                value={formData.contact}
                onChange={handleChange}
              />

              <CustomTextField
                fullWidth
                id="password"
                label="Password*"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: "gray",
                          "&:hover": {
                            color: "white",
                          },
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <CustomTextField
                fullWidth
                id="confirmPassword"
                label="Confirm Password * "
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{
                          color: "gray",
                          "&:hover": {
                            color: "white",
                          },
                        }}
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <CustomFormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "#252525", // Ensures the dropdown menu container is black
                        color: "gray",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Drop shadow for the dropdown container
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="it_operation_manager"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333", // Hover effect background color for options
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#333333", // Selected background color
                        color: "white", // Selected text color
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#333333", // Keeps the selected color when hovering on the selected option
                      },
                      fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                      fontSize: "14px",
                    }}
                  >
                    IT Operation Manager
                  </MenuItem>
                  <MenuItem
                    value="database_management"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333", // Hover effect background color for options
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#333333", // Selected background color
                        color: "white", // Selected text color
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#333333", // Keeps the selected color when hovering on the selected option
                      },
                      fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                      fontSize: "14px",
                      marginTop: "2px",
                    }}
                  >
                    Database Management
                  </MenuItem>
                  <MenuItem
                    value="it_security"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333", // Hover effect background color for options
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#333333", // Selected background color
                        color: "white", // Selected text color
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#333333", // Keeps the selected color when hovering on the selected option
                      },
                      fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                      fontSize: "14px",
                      marginTop: "2px",
                    }}
                  >
                    IT Security
                  </MenuItem>
                  <MenuItem
                    value="system_infrastructure"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333", // Hover effect background color for options
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#333333", // Selected background color
                        color: "white", // Selected text color
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#333333", // Keeps the selected color when hovering on the selected option
                      },
                      fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                      fontSize: "14px",
                      marginTop: "2px",
                    }}
                  >
                    System Infrastructure
                  </MenuItem>
                  <MenuItem
                    value="network_infrastructure"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#333333", // Hover effect background color for options
                        color: "white",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#333333", // Selected background color
                        color: "white", // Selected text color
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#333333", // Keeps the selected color when hovering on the selected option
                      },
                      fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                      fontSize: "14px",
                      marginTop: "2px",
                    }}
                  >
                    Network Infrastructure
                  </MenuItem>
                </Select>
              </CustomFormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    sx={{
                      color: "gray",
                    }}
                  />
                }
                label={
                  <span className="text-sm text-gray-400">
                    I accept the{" "}
                    <Link to="/terms" className="text-red-500 hover:underline">
                      Terms and Conditions
                    </Link>
                  </span>
                }
              />
              {errors.termsAccepted && (
                <p className="text-red-500 text-xs">{errors.termsAccepted}</p>
              )}

              <Button
                fullWidth
                variant="contained"
                color="error"
                type="submit"
                sx={{
                  "&:hover": {
                    backgroundColor: "#942626",
                  },
                  backgroundColor: "#7A2424",
                  fontFamily: "'Poppins', sans-serif", // Apply Poppins font to options
                }}
              >
                Create an account
              </Button>

              <p className="text-sm text-gray-400 mt-6 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;

//Commented Past code
{
  /*import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../images/itopslogo.png";
function Register() {
  return (
    <>
      <section className="flex flex-col md:flex-row h-screen">
        {/* Left section with full background image }
        <div
          className="md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Logo})` }}
        >
          <div className="bg-gray-900 bg-opacity-10 flex items-center justify-center h-full">
          </div>
        </div>

        {/* Right section with registration form }
        <div className="md:w-1/2 w-full bg-[#222426] flex items-center justify-center py-8 md:py-0">
          <div className="bg-[#333333] p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl md:text-2xl text-white mb-6 md:mb-8 text-center">
              Create an account
            </h1>

            <form className="space-y-6">
              <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                  <input
                    type="fullname"
                    id="fullname"
                    className="peer w-full p-3 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  <label class="absolute cursor-text bg-[#333333] px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                    Full name
                  </label>
                </div>
              </div>
              <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    className="peer w-full p-3 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  <label class="absolute cursor-text bg-[#333333] px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                    Email
                  </label>
                </div>
              </div>
              <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                  <input
                    type="text"
                    id="contact"
                    className="peer w-full p-3 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  <label class="absolute cursor-text bg-[#333333] px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                    contact
                  </label>
                </div>
              </div>


              {/* Password Input }
              <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                  <input
                    type="password"
                    id="password"
                    className="peer w-full p-3 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  <label class="absolute cursor-text bg-[#333333] px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                    contact
                  </label>
                </div>
              </div>

              {/* Confirm Password Input }
              <div class="w-full max-w-sm min-w-[200px]">
                <div class="relative">
                  <input
                    type="password"
                    id="confirm_pass"
                    className="peer w-full p-3 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    required
                  />
                  <label class="absolute cursor-text bg-[#333333] px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                    contact
                  </label>
                </div>
              </div>
              <div className="">
                <select
                  className="w-full p-3 bg-gradient-to-r from-[#333333] to-[#C4C4C4] text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  name="designation"
                  required
                >
                  <option value="">Designation</option>
                  <option value="it_operation_manager">
                    IT Operation Manager
                  </option>
                  <option value="database_management">
                    Database Management
                  </option>
                  <option value="it_security">IT Security</option>
                  <option value="system_infrastructure">
                    System Infrastructure
                  </option>
                  <option value="network_infrastructure">
                    Network Infrastructure
                  </option>
                </select>
              </div>

              {/* Terms Checkbox }
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I accept the{" "}
                  <a href="#" className="text-red-500 hover:underline">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Submit Button }
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200"
              >
                Create an account
              </button>

              {/* Login Redirect }
              <p className="text-sm text-gray-400 mt-6 text-center">
                Already have an account?{" "}
                <a href="#" className="text-white hover:underline">
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;*/
}

{
  /*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Your registration logic here (API call)

    // On successful registration, redirect to the login page
    navigate('/login');
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;*/
}
