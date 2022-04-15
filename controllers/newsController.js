const NewsModel = require("../models/NewsModel");
const imageToBase64 = require("image-to-base64");

//Add news
const addNews = async (req, res, next) => {
  try {
    console.log(req.files);
    console.log(req.body);

    const { auther, title, content, category, addToSlider } = req.body;
    const base64Data = await imageToBase64(req.files.newsImage.path);
    console.log("base64Data===>", base64Data);
    const news = new NewsModel({
      auther,
      title,
      content,
      category,
      addToSlider,
      newsImage: `data:${req.files.newsImage.type};base64,${base64Data}`,
      addedAt: Date.now(),
    });

    await news.save((err, news) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: `News added successfully`,
        data: news,
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

// grt all news
const getNews = async (req, res, next) => {
  try {
    const allNews = await NewsModel.find({});

    if (allNews) {
      res.json({
        success: true,
        count: allNews.length,
        data: allNews,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

//get News by PageNumber and PageSize
const getNewsPageNoPageSize = async (req, res, next) => {
  try {
    const size = req.params.pageSize;
    const pageNumber = req.params.pageNumber;

    let query = {};
    if (pageNumber > 0 || pageNumber == 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid page number, should start with 1",
      });
    }
    query.skip = size * (pageNumber - 1);
    query.limit = size;

    const newsCount = await NewsModel.find({});
    const news = await NewsModel.find({})
      .sort("-addedAt")
      .populate({ path: "category", select: ["_id", "category_name"] })
      .limit(Number(query.limit))
      .skip(Number(query.skip));

    if (news) {
      res.json({
        success: true,
        // count: news.length,
        count: newsCount.length,
        data: news,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

//get News by id
const getNewsById = async (req, res, next) => {
  try {
    const news = await NewsModel.findById(req.params.newsId).populate({
      path: "category",
      select: ["_id", "category_name"],
    });

    if (news) {
      res.json({
        success: true,
        data: news,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

//get Slider News
const getSliderNews = async (req, res, next) => {
  try {
    const news = await NewsModel.find({ addToSlider: true }).populate({
      path: "category",
      select: ["_id", "category_name"],
    });

    if (news) {
      res.json({
        success: true,
        count: news.length,
        data: news,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

//get Category News by category id
const getNewsByCategory = async (req, res, next) => {
  try {
    const news = await NewsModel.find({ category: req.params.catId }).populate({
      path: "category",
      select: ["_id", "category_name"],
    });

    if (news) {
      console.log("===getNewsByCategory===");
      res.json({
        success: true,
        count: news.length,
        data: news,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

// delete news by id
const deleteNews = async (req, res, next) => {
  try {
    const news = await NewsModel.findByIdAndDelete(req.params.newsId);
    if (!news) {
      return res.status(401).json({
        success: false,
        message: "News not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully deleted",
        data: news,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

//update news by Id
const updateNews = async (req, res, next) => {
  try {
    const news = await NewsModel.findByIdAndUpdate(
      req.params.newsId,
      req.body,
      { new: true, runValidators: true }
    );

    if (news) {
      res.json({
        success: true,
        message: "Successfully updated",
        data: news,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "News not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server having some issues",
    });
  }
};

module.exports = {
  addNews,
  getNews,
  getNewsPageNoPageSize,
  getNewsById,
  getSliderNews,
  getNewsByCategory,
  deleteNews,
  updateNews,
};
