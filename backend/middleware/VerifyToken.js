import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // No token provided
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = decoded; // Store decoded token info (userId, email, etc.) in req.user
    next();
  });
};
