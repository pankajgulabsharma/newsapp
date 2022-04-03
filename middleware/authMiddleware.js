const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("token==>", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded==>", decoded);
      // req.header = await User.findById(decoded.id).select("-password");
      req.header = await User.findById(decoded._id).select("-password");
      console.log("req.header==>", req.header);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Session Expired",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

module.exports = protect;
