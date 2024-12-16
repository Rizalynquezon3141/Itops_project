import { useEffect, useState } from "react";

// MUI Components
import TextField from "@mui/material/TextField"; // Import Material-UI's TextField component
import Button from "@mui/material/Button"; // Import Material-UI's Button component
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import PhoneIcon from "@mui/icons-material/Phone";
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
    fontSize: "14px", // Adjust the font size for the input text
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
    fontSize: "14px", // Ensure autofilled input text uses the same font size
  },
  "& input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px #333333 inset", // Ensure the same background when focused
    WebkitTextFillColor: "white", // Keep text white when autofilled and focused
    fontFamily: "'Poppins', sans-serif", // Ensure autofilled text uses Poppins font
    fontSize: "16px", // Keep the font size for autofilled inputs
  },
}));

function Settings() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    contact: "",
    designation: "",
  });

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    contact: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const [bgColor, setBgColor] = useState("");

  // Predefined list of background colors
  const colors = [
    "#f94144",
    "#f3722c",
    "#f8961e",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
  ];
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState(null);
  const [errormes, setErrormes] = useState(null);

  // Function to generate random color from the array
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Retrieve the firstname and lastname from local storage
    const storedfirstname = localStorage.getItem("firstname");
    const storedlastname = localStorage.getItem("lastname");

    if (storedfirstname) setFirstName(storedfirstname);
    if (storedlastname) setlastName(storedlastname);
  }, []);

  // Set a random color when component mounts
  useEffect(() => {
    setBgColor(getRandomColor());
  }, []);

  // Get first letter of firstname and lastname
  const initials = `${firstName?.charAt(0).toUpperCase()}${lastName
    ?.charAt(0)
    .toUpperCase()}`;
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
      setFormValues({
        fullName: data.fullName,
        email: data.email,
        contact: data.contact,
      }); // Initialize formValues with fetched data
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Handle form value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the updated data to the backend
      const response = await fetch("http://localhost:5000/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      // Update the user state with the new values
      setUser(formValues);
      alert("Changes saved successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      setErrormes("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use the token for authentication
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      // Handle successful password change
      alert("Password changed successfully!");

      // Optionally, reset the form
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <div className="text-neutral-400 flex px-8">
        <h1 className="text-1xl font-bold mb-4 flex-1">Settings</h1>
        <p className="text-sm">DBAdministration &gt; Settings</p>
      </div>
      <div className="flex flex-col xl:flex-row min-h-screen p-4 text-neutral-400">
        <div className="bg-[#333333] p-6 mb-4 lg:mb- lg:mr-4 shadow-lg rounded-lg h-fit w-full xl:w-[610px] flex-none flex justify-center ">
          <div className="mr-4 w-full">
            <h1 className="text-2xl text-center font-bold mb-4">Profile</h1>
            <div className="flex justify-center mb-4 relative">
              <div
                className="rounded-full border-2 border-primary w-24 h-24 flex justify-center items-center text-white"
                style={{
                  backgroundColor: bgColor,
                  fontSize: "32px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                {initials}
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-neutral-300">{user.fullName}</h1>
              <p className="text-xs">{user.designation}</p>
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
                  name="fullName" // Use name instead of id
                  label="Full Name*"
                  value={formValues.fullName}
                  onChange={handleChange}
                />
                <CustomTextField
                  fullWidth
                  name="email" // Use name instead of id
                  label="Email Address*"
                  value={formValues.email}
                  onChange={handleChange}
                />
                <CustomTextField
                  fullWidth
                  name="contact" // Use name instead of id
                  label="Contact Number*"
                  value={formValues.contact}
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

                {error && <p className="error-message">{error}</p>}
              </form>
            </div>
          </div>
          <div className="bg-[#333333] p-6 shadow-lg h-fit rounded-lg">
            <div
              className="mb-10 border-b pb-8 "
              style={{ borderColor: "#252525" }}
            >
              <h1>Change Your Password</h1>
            </div>
            <div>
              <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                <CustomTextField
                  fullWidth
                  name="newpassword" // Use name instead of id
                  label="New Password*"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <CustomTextField
                  fullWidth
                  name="confirmnewpassword" // Use name instead of id
                  label="Confirm New Password*"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
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

                {errormes && <p className="error-message">{errormes}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;