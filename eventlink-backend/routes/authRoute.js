
const express = require("express");
const router = express.Router();

const authController = require("../Controller/authController");

// Register a customer or vendor
router.post("/register", authController.register);

// Log in
router.post("/login", authController.login);

module.exports = router;
