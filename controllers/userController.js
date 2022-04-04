const User = require("../models/UserModel");
const mailer = require("../utils/Mailer");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto"); // inbuild module or package of nodejs

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      //(userExists && userExists.active)
      return res.status(400).json({
        success: false,
        message:
          "Entered mail is is already registered with us. Login to continue",
      });
    }
    //  else if (userExists && !userExists.active) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Account created but need to activate.A link sent with your registered mobile number",
    //   });
    // }

    const user = new User({
      name,
      email,
      password,
    });

    /*
    // Generate 20 bit activation code, crypto is build in package of nodejs
    crypto.randomBytes(20, function (err, buf) {
      //Ensure the activation  linkk is unique
      user.activeToken = user._id + buf.toString("hex");

      //set expiration time is 24 hours
      user.activeExpires = Date.now() + 24 * 3600 * 1000;
      var link =
        process.env.NODE_ENV == "development"
          ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
          : `${process.env.api_host}/api/users/active/${user.activeToken}`;

      //sending activation mail
      mailer.send({
        to: req.body.email,
        subject: "Welcome",
        html:
          'Please click <a href="' +
          link +
          '"> here </a> to activate your account.',
      });

      //save user object
      user.save(function (err, user) {
        if (err) return next(err);
        res.status(201).json({
          success: true,
          message: `The activation link has been sent to ${user.email}, please click the activation link`,
        });
      });
    });
    */

    //save user object
    user.save(function (err, user) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        // message: `The activation link has been sent to ${user.email}, please click the activation link`,
        message: `Account created successfully. Please login`,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

/*
const activeToken = async (req, res, next) => {
  //find the corresponding user
  User.findOne(
    {
      activeToken: req.params.activeToken,
      // activeExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (err) return next(err);

      //If invalid activation token or code
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Your activation link is invalid",
        });
      }

      if (user.active == true) {
        return res.status(200).json({
          success: true,
          message:
            "Your account is already activated go and login to use this app",
        });
      }

      //if not activated active and save
      user.active = true;
      user.save(function (err, user) {
        if (err) return next(err);

        //Activation success
        res.status(200).json({
          success: true,
          message: "Activation success",
        });
      });
    }
  );
};
*/

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("authUser==>", user);

  if (user && user.matchPassword(password)) {
    // _id: user._id  or  _id: user.id  both r same
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorised user",
    });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.header.id);
  console.log("getUserProfile===>", user);

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

const updateUserProfile = async (req, res) => {
  console.log("req.header==>", req.header);
  // console.log("res==>", res);
  const user = await User.findById(req.header._id);

  if (user) {
    user.name = req.body.name || req.name;
    user.email = req.body.email || req.email;
    user.avatar = req.body.avatar || req.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

module.exports = {
  registerUser,
  // activeToken,
  authUser,
  getUserProfile,
  updateUserProfile,
};
