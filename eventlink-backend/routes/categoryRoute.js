
const express = require("express");
const router = express.Router();

const categoryController = require("../Controller/categoryController");

// GET all categories
router.get("/", categoryController.getAllCategories);

module.exports = router;
