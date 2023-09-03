const db = require("../Models/db"); // Import your database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const axios = require("axios");

exports.login = (req, res) => {
  console.log("Request received for /login");
  const { email, password } = req.body;

  console.log("Email:", email);
  console.log("Password:", password);

  const query = `SELECT id, email, password FROM register WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    console.log("Query Results:", results);

    if (results.length === 0) {
      console.error("No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    console.log("Stored Password:", user.password); // Add this line for debugging

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("isPasswordValid:", isPasswordValid);

    if (!isPasswordValid) {
      console.error("Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    return res.status(200).json({ message: "Login successful" });
  });
};
