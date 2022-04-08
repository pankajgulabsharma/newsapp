const Category = require("../models/CategoryModel");

//add the category
const addCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const category = await Category.findOne({ category_name: category_name });
    if (category) {
      return res.status(401).json({
        success: false,
        message: "Category already exist",
      });
    }

    // using create() method          Note:=> create() is a static method which is using with model class
    // const new_category = await Category.create({
    //   category_name: category_name,
    // });

    //==========================or ======================

    //using save() method           Note:=> save() is a instance method which is used by creating instance and then using save() on instance
    const new_category = new Category({ category_name: category_name });
    await new_category.save((err, new_category) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: "Category is created successfully",
        data: new_category,
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

// get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    if (categories) {
      res.json({
        success: true,
        data: categories,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Categories not found",
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

// delete category
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.catId);
    if (category) {
      res.json({
        success: true,
        message: "Successfully deleted",
        data: category,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "category not found",
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

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.catId,
      req.body,
      { new: true, runValidators: true }
    );

    if (category) {
      res.json({
        success: true,
        message: "Successfully updated",
        data: category,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "category not found",
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
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
