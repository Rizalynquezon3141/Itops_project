import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fetch Users
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "contact", "designation"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
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
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  // Check if terms are accepted
  if (!termsAccepted) {
    return res
      .status(400)
      .json({ msg: "You must accept the terms and conditions to register." });
  }

  try {
    // Generate hashed password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user in the database
    await Users.create({
      fullname: fullname,
      email: email,
      contact: contact,
      password: hashPassword,
      designation: designation,
      termsAccepted: termsAccepted, // Ensure termsAccepted is stored in the database
    });

    res.json({ msg: "Registration Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error: " + error.message });
  }
};

// Login User
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email } }); // Use findOne instead of findAll

    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong Password" });
    }

    // Generate access and refresh tokens
    const { id: userId, fullname } = user; // Destructure user properties
    const accessToken = jwt.sign({ userId, fullname, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m' // Changed to a more realistic expiry time
    });
    const refreshToken = jwt.sign({ userId, fullname, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    // Store refresh token in the database
    await Users.update({ refresh_token: refreshToken }, { where: { id: userId } });

    const v = "dsdsfs"
    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ msg: "Login Successful", accessToken, userId: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Logout User
export const Logout = async (req, res) => {
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
};

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
