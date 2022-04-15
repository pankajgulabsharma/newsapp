const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  addNews,
  getNewsPageNoPageSize,
  getNews,
  getNewsById,
  getSliderNews,
  getNewsByCategory,
  deleteNews,
  updateNews,
} = require("../controllers/newsController");

router.route("/addNews").post(protect, addNews);
router.route("/getAllNews").get(getNews);
router.route("/getAllNews/:pageNo/:pageSize").get(getNewsPageNoPageSize);
router.route("/getById/:newsId").get(getNewsById);
router.route("/getAllNews/slider").get(getSliderNews);
router.route("/getByCategory/:catId").get(getNewsByCategory);
router.route("/deleteNews/:newsId").delete(protect, deleteNews);
router.route("/updateNews/:newsId").put(protect, updateNews);

module.exports = router;
