import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fetch Users
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "fullname", "email", "contact", "designation"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Register User
export const Register = async (req, res) => {
  const {
    fullname,
    email,
    contact,
    password,
    confirmPassword,
    designation,
    termsAccepted,
  } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match." });
  }

  // Check if terms are accepted
  if (!termsAccepted) {
    return res
      .status(400)
      .json({ msg: "You must accept the terms to register." });
  }

  try {
    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already registered." });
    }

    // Generate hashed password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user in the database
    await Users.create({
      fullname,
      email,
      contact,
      password: hashPassword,
      designation,
      termsAccepted,
    });

    res.status(201).json({ msg: "Registration Successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: "Error: " + error.message });
  }
};

// Login User
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ msg: "Email not found." });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    // Generate access and refresh tokens
    const { id: userId, fullname } = user; // Destructure user properties
    const accessToken = jwt.sign(
      { userId, fullname, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Token expires in 15 minutes
    );
    const refreshToken = jwt.sign(
      { userId, fullname, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } // Refresh token expires in 1 day
    );

    // Store refresh token in the database (optional, for better security)
    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    // Set refresh token as a cookie (optional)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookie is secure in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with access token and user ID
    res.status(200).json({
      msg: "Login Successful",
      accessToken,
      userId,
    });
  } catch (error) {
    console.error("Error during login:", error.message || error); // Log the error message
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Logout User
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Retrieve the refresh token from the cookies

  // Check if refresh token is present
  if (!refreshToken) {
    return res.status(204).send(); // No content
  }

  try {
    // Find user by refresh token
    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });

    // If user is not found, clear the cookie and respond
    if (!user) {
      res.clearCookie("refreshToken"); // Clear cookie if user not found
      return res.status(204).send(); // No content
    }

    // Invalidate the refresh token (remove it from the user's record)
    await Users.update({ refresh_token: null }, { where: { id: user.id } });

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    return res.status(200).send(); // OK
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ msg: "Internal Server Error" }); // Handle internal server errors
  }
};


// Login User
{
  /*export const Login = async(req, res) => {
  try {
      const user = await Users.findAll({
          where: { email: req.body.email }
      });

      if (user.length === 0) {
          return res.status(404).json({ msg: "Email not found" });
      }

      const match = await bcrypt.compare(req.body.password, user[0].password);
      if (!match) return res.status(400).json({ msg: "Wrong Password" });

      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15s'
      });
      const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '1d'
      });

      await Users.update({ refresh_token: refreshToken }, {
          where: { id: userId }
      });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.json({ accessToken });
  } catch (error) {
      res.status(404).json({ msg: "Email not found" });
  }
}*/
}

// Logout User
{
  /*export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Users.findAll({
    where: { refresh_token: refreshToken },
  });

  if (!user[0]) return res.sendStatus(204);

  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: { id: userId },
    }
  );

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};*/
}

/*import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
 
export const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}
 
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}*/
