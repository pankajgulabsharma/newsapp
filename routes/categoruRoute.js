const express = require("express");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} = require("../controllers/categoryController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.route("/addCategory").post(protect, addCategory); // here protect indicates that u have to add Authorization with Bearer token
router.route("/deleteCategory/:catId").delete(protect, deleteCategory); // here protect indicates that u have to add Authorization with Bearer token
router.route("/getAllCategory").get(getAllCategories);
router.route("/updateCategory/:catId").put(protect, updateCategory); // here protect indicates that u have to add Authorization with Bearer token

module.exports = router;
