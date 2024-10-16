import { useEffect, useState } from "react";

import UploadProfileModal from "../Modal/UploadProfileModal";
// MUI Components
import TextField from "@mui/material/TextField"; // Import Material-UI's TextField component
import Button from "@mui/material/Button"; // Import Material-UI's Button component
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import PhoneIcon from "@mui/icons-material/Phone";
import { IconButton } from "@mui/material"; // Import IconButton from Material-UI
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon
import { styled } from "@mui/material/styles"; // Import styled utility from Material-UI

function Settings() {
  const [user, setUser] = useState({
    fullname: localStorage.getItem("fullname") || "",
    email: "",
    contact: "",
    designation: localStorage.getItem("designation") || "",
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://openui.fly.dev/openui/100x100.svg?text=👤"
  );
  const [originalImage, setOriginalImage] = useState(profileImage); // Keep track of the original image
  //Retrieve the values from localStorage
  const [fullname, setFullname] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    // Retrieve the values from localStorage when the component mounts
    const storedFullname = localStorage.getItem("fullname");
    const storedDesignation = localStorage.getItem("designation");

    if (storedFullname) setFullname(storedFullname);
    if (storedDesignation) setDesignation(storedDesignation);
  }, []);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data); // Set user data
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/update-user", {
        // Your API endpoint to update user
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(user), // Send the updated user data
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update local user state with the response data
      setSuccessMessage("User details updated successfully!"); // Set success message
    } catch (err) {
      setError(err.message);
    }
  };

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

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleImageUpload = (newImage) => {
    setProfileImage(newImage); // Update the profile image state
  };

  const handleCancel = () => {
    setProfileImage(originalImage); // Revert to the original image
    setIsEditing(false); // Close the modal
  };

  const handleUploadConfirm = () => {
    // You can add logic here to handle the upload action if needed
    console.log("Profile picture uploaded!");
    setIsEditing(false); // Close the modal after upload
  };
  return (
    <div>
      <div className="text-neutral-400 flex px-8">
        <h1 className="text-1xl font-bold mb-4 flex-1">Settings</h1>
        <p className="text-sm">DBAdministration &gt; Settings</p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen p-4 text-neutral-400">
        <div className="bg-[#333333] p-6 mb-4 lg:mb-0 lg:mr-4 shadow-lg rounded-lg h-fit w-full lg:w-[610px] flex-none flex justify-center">
          <div className="mr-4 w-full">
            <h1 className="text-2xl text-center font-bold mb-4">Profile</h1>
            <div className="flex justify-center mb-4 relative">
              <img
                src={profileImage}
                alt="User Avatar"
                className="rounded-full border-2 border-primary w-24 h-24"
              />

              <IconButton
                onClick={toggleEdit}
                sx={{
                  position: "absolute", // equivalent to "absolute"
                  bottom: 0, // equivalent to "bottom-0"
                  right: "38%", // equivalent to "right-0"
                  margin: 1, // equivalent to "m-1" (spacing)
                  borderRadius: "50%", // equivalent to "rounded-full"
                  backgroundColor: "#5C7E59", // Background color
                  border: "1px solid #2F6A2A", // Green border
                  boxShadow: 2, // equivalent to "shadow" (MUI's shadow values)
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition for background and border color
                  "&:hover": {
                    backgroundColor: "#252525", // Hover background color
                  },
                }}
                aria-label="edit"
              >
                <EditIcon className="text-neutral-300 " />
              </IconButton>
            </div>

            {/* Upload Profile Modal */}
            <UploadProfileModal
              isOpen={isEditing}
              onClose={handleCancel} // Close the modal without saving
              onConfirm={handleUploadConfirm}
              handleFileChange={handleImageUpload}
              originalImage={originalImage} // Pass originalImage as a prop
            />
            <div className="text-center">
              <h1 className="text-neutral-300">{fullname}</h1>
              <p className="text-xs">{designation}</p>
            </div>
            <div className="flex flex-col p-4 border border-neutral-500 rounded-md mt-5">
              {user && (
                <>
                  <div className="flex items-center mb-2 justify-between p-3 border-b border-neutral-500">
                    <EmailIcon
                      sx={{
                        fontSize: "20px",
                      }}
                    />
                    <span className="text-primary text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <PhoneIcon
                      sx={{
                        fontSize: "20px",
                      }}
                    />
                    <span className="text-primary text-sm">{user.contact}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-4">
          <div className="bg-[#333333] p-6 shadow-lg h-fit rounded-lg">
            <div
              className="mb-10 border-b pb-8 "
              style={{ borderColor: "#252525" }}
            >
              <h1>User Information</h1>
            </div>
            <div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <CustomTextField
                  fullWidth
                  id="fullname"
                  label="Full Name*"
                  value={user.fullname}
                  onChange={handleChange}
                />
                <CustomTextField
                  fullWidth
                  id="email"
                  label="Email Address*"
                  value={user.email}
                  onChange={handleChange}
                />
                <CustomTextField
                  fullWidth
                  id="contact"
                  label="Contact Number*"
                  value={user.contact}
                  onChange={handleChange}
                />

                <Button
                  type="submit" // Submit button
                  variant="contained" // Material-UI button variant
                  startIcon={<SaveIcon />}
                  sx={{
                    marginTop: "7px",
                    backgroundColor: "#252525", // Background color
                    border: "1px solid #2F6A2A", // Green border
                    width: "200px", // Fixed width
                    height: "40px", // Fixed height
                    fontSize: "11px",
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition for background and border color
                    "&:hover": {
                      backgroundColor: "#5C7E59", // Hover background color
                    },
                  }}
                >
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
          <div className="bg-[#333333] p-6 shadow-lg h-fit rounded-lg">
            <div>
              <h1>Change Your Password</h1>
            </div>
            <div>
              <p>New Password</p>
              <p>Confirm New Password</p>
            </div>
            <Button
              type="submit" // Submit button
              variant="contained" // Material-UI button variant
              startIcon={<SaveIcon />}
              sx={{
                marginTop: "7px",
                backgroundColor: "#252525", // Background color
                border: "1px solid #2F6A2A", // Green border
                width: "200px", // Fixed width
                height: "40px", // Fixed height
                fontSize: "11px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition for background and border color
                "&:hover": {
                  backgroundColor: "#5C7E59", // Hover background color
                },
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

{
  /*import { useEffect, useState } from "react";
import Button from "@mui/material/Button"; // Import Material-UI's Button component

function Settings() {
  // Retrieve the values from localStorage
  const [fullname, setFullname] = useState("");
  const [designation, setDesignation] = useState("");
 const [user, setUser] = useState(null); // Change to store user object
  //const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    // Retrieve the values from localStorage when the component mounts
    const storedFullname = localStorage.getItem("fullname");
   const storedDesignation = localStorage.getItem("designation");
   // const storedToken = localStorage.getItem("accessToken"); // Get the token

    if (storedFullname) setFullname(storedFullname);
    if (storedDesignation) setDesignation(storedDesignation);
    //if (storedToken) setToken(storedToken); // Set the token state
  }, []);

  /*useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token in the request
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data); // Set the user data
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token]);


  return (
    <div>
      <div className="text-neutral-400 flex px-8">
        <h1 className="text-1xl font-bold mb-4 flex-1">Settings</h1>
        <p className="text-sm">DBAdministration &gt; Settings</p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen p-4 text-neutral-400">
        <div className="bg-[#333333] p-6 mb-4 lg:mb-0 lg:mr-4 shadow-lg rounded-lg h-fit w-full lg:w-[610px] flex-none flex justify-center">
          <div className="mr-4 w-full">
            <h1 className="text-2xl text-center font-bold mb-4">Profile</h1>
            <div className="flex justify-center mb-4">
              <img
                src="https://openui.fly.dev/openui/100x100.svg?text=👤"
                alt="User Avatar"
                className="rounded-full border-2 border-primary w-24 h-24"
              />
            </div>
            <div className="text-center">
              <h1 className="text-neutral-300">{fullname}</h1>
              <p className="text-xs">{designation}</p>
            </div>
            <div className="flex flex-col">
              <label className="block text-muted mt-6">Upload</label>
              {/* Add w-full class to make the file input take the full width }
              <input
                type="file"
                className="border border-border rounded p-2 mt-2 flex-1"
                // onChange={handleFileChange} // Add a change handler
              />
              <Button
                type="submit" // Submit button
                variant="contained" // Material-UI button variant
                fullWidth // Full width button
                sx={{
                  marginTop: "7px",
                  backgroundColor: "#7A2424", // Background color
                  "&:hover": {
                    backgroundColor: "#942626", // Hover background color
                  },
                }}
              >
                Upload Profile
              </Button>

              {user && (
                <>
                  <div className="flex items-center mb-2">
                    <img
                      aria-hidden="true"
                      alt="email-icon"
                      src="https://openui.fly.dev/openui/24x24.svg?text=✉️"
                      className="mr-2"
                    />
                    <span className="text-primary"></span>
                  </div>
                  <div className="flex items-center">
                    <img
                      aria-hidden="true"
                      alt="phone-icon"
                      src="https://openui.fly.dev/openui/24x24.svg?text=📞"
                      className="mr-2"
                    />
                    <span className="text-primary"></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-4">
          <div className="bg-[#333333] p-6 shadow-lg h-96">
            Top Right Content
          </div>
          <div className="bg-[#333333] p-6 shadow-lg h-96">
            Bottom Right Content
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;


{
  /*import React from "react";

function Settings() {
  return (
    <div>
      <div class="flex flex-col lg:flex-row min-h-screen p-4">
        <div class="bg-[#333333] p-6 mb-4 lg:mb-0 lg:mr-4 shadow-lg rounded-lg w-[400px] sm:w-[px] md:w-[1000px] lg:w-[300px] h-96">
          Left Side Content
        </div>

        <div class="flex flex-col flex-1 space-y-4">
          <div class="bg-gray-400 flex-1 p-6">Top Right Content</div>

          <div class="bg-gray-500 flex-1 p-6">Bottom Right Content</div>
        </div>
      </div>
    </div>
  );
}

export default Settings;*/
}

{
  /*p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px] <shadow-lg></shadow-lg>}

{
  /*import React from "react";

// Shared Tailwind CSS classes
const inputClasses = "border border-border rounded p-2 w-full";
const buttonClasses =
  "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded p-2";
const labelClasses = "block text-muted";

function Settings() {
  return (
    <div>
      <div className="p-6 bg-card text-foreground">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex mb-6">
          <div className="w-1/3 mr-4">
            <div className="flex items-center mb-4">
              <img
                src="https://openui.fly.dev/openui/100x100.svg?text=👤"
                alt="User Avatar"
                className="rounded-full border-2 border-primary w-24 h-24"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClasses}>Upload</label>
              <input type="file" className={`mt-2 ${inputClasses}`} />
            </div>
          </div>
          <div className="w-2/3">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <div className="mb-4">
              <label className={labelClasses}>Full Name</label>
              <input
                type="text"
                value="Rizalyn Quezon"
                className={inputClasses}
              />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                value="rizalyn.quezon@gmail.com"
                className={inputClasses}
              />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Contact Number</label>
              <input type="text" value="09484724949" className={inputClasses} />
            </div>
            <button className={buttonClasses}>Save Changes</button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Change Your Password</h2>
          <div className="mb-4">
            <label className={labelClasses}>New Password</label>
            <input type="password" className={inputClasses} />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Confirm New Password</label>
            <input type="password" className={inputClasses} />
          </div>
          <button className={buttonClasses}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;*/
}

{
  /*import React, { useState } from 'react';
import axios from 'axios';


const Settings = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profilePicture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phoneNumber);
    formData.append('password', profileData.password);
    formData.append('profilePicture', profileData.profilePicture);

    try {
      const response = await axios.post('/api/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );  };
  
  export default Settings;*/
}
