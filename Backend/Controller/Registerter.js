
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const router = express.Router();



// Route for user registration


router.post("/register", async function (req, res) {
    const {userName , password, email  }  = req.body;
    try {
      if (!userName || ! ) {
        return res.json({ status: "error", message: "Email already registered" });
      }
  
          await User.create({
            username: user.username,
            email: user.email,
            password: user.password,
          });
  
          foundUser = await User.findOne({ email: user.email });
          const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET);
          console.log("User created successfully");
          console.log(token);
  
          // fs.unlinkSync(`Pictures/NewsPictures/${uploadedImage.filename}.jpg`);
          return res.json({ status: "Success", token ,name: foundUser.username});
  
    } catch (err) {
      console.log(err);
      return res.json({ error: err });
    }
  });

  module.exports = router;