import jwt from 'jsonwebtoken'
import { User } from '../model/UserModel.js';
export const isAuth = async (req, res, next) => {


  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login - No Token",
      });
    }
    const decodedData = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedData) {
      return res.status(400).json({
        message: "invalid token",
      });
    }
    const user = await User.findById(decodedData.id);
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: error.message
    })
  }

}
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

