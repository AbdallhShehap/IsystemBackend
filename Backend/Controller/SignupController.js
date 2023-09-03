const express = require('express');
const db = require('../Models/db');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const axios = require("axios");


// Handle user signup
exports.signup = async(req, res) => {
  try{
      
    const { username,email, password } = req.body;

    if (!username || !password) {
      throw new Error("All fields must be filled");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
      
    const Values = [
      username,email, hash 
    ];
    const userInfoQuery = `INSERT INTO register (username,email, password) 
    VALUES (?,?,?) `;

    console.log("SQL Query:", userInfoQuery);
    console.log("Values:", Values);



    db.query(userInfoQuery, Values, function (err, results) {

      if (err) {
          console.error("MySQL Error:", err);
          return res.status(500).json({ message: "Error inserting user info" });
        }
  
        
        return res.status(200).json({ message: "Values inserted successfully" });
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
};

