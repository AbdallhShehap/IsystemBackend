const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const router = express.Router();



// Route for user login
router.post("/login", async function (req, res) {
    const { email, password } = req.body;
    try {
      const foundUser = // Bring if the email from databass
      if (!foundUser) {
        return res.json({ status: "error", message: "User didn't exist!" });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isPasswordValid) {
        return res.json({
          status: "error",
          message: "Username or Password is not correct",
        });
      }
  
      const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET);
  
      return res.json({status:"success", token, userID: foundUser._id ,name: foundUser.username});
    } catch (err) {
      console.log(err);
      return res.json({ error: err });
    }
  });
  
  
  
  
  module.exports = router;