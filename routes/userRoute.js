const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  activeToken,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.route("/").post(registerUser);
// router.route("/active/:activeToken").get(activeToken);   // this route is for active token thats why we are desabled it
router.route("/login").post(authUser);

//for this route 1st go and do login using /login route and then u will get token over there u need to take that token without "" and go to this current route (/profile) and go to Authorization setion and in Type select Bearer Type and then in Token section paste the token data which we are taking from /login route
router.route("/profile").get(protect, getUserProfile); // this URL is protected

router.route("/profile").put(protect, updateUserProfile);

module.exports = router;
