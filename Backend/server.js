//Import Modules
const express = require("express");
const cors =require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const PORT = process.env.PORT ;



const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Create a connection to the database
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sql_register",
});


dbConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});




app.get('/', (req, res) => {
    res.send('Welcome to the Isystem e-commerce ');
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})




const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create a connection to the database
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sql_register",
});

dbConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

app.post("/otp", (req, res) => {
  const { email } = req.body;

  // Check if the email is provided and is a valid email format
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  // Check if the email exists in the 'users' table
  const checkEmailQuery = `
        SELECT email FROM users WHERE email = ?
      `;

  dbConnection.query(checkEmailQuery, [email], (err, emailResults) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ message: "An error occurred" });
    }

    // If the email already exists, send a response indicating it's registered
    if (emailResults.length > 0) {
      return res.json({ message: "Email already registered" });
    }

    // Generate a fixed OTP for demonstration purposes
    const otp = "123456";

    // Insert the email and OTP into the 'email' table
    const emailInsertQuery = `
          INSERT INTO email (email, otp)
          VALUES (?, ?)
        `;

    dbConnection.query(emailInsertQuery, [email, otp], (err, emailResult) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res
          .status(500)
          .json({ message: "Error inserting email and OTP" });
      }
      console.log("Email and OTP inserted successfully");
      return res.json({ message: "success", otp });
    });
  });
});

app.post("/signup", async (req, res) => {
  console.log("Request received for /signup");
  try {
    const {
      photoUrl,
      fullName,
      number,
      gender,
      birthdate,
      nationality,
      city,
      password,
      email,
    } = req.body;

    if (!fullName || !password) {
      throw new Error("All fields must be filled");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userInfoQuery = `
      INSERT INTO users (photoUrl, fullName, number, gender, birthdate, nationality, city, password, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      photoUrl,
      fullName,
      number,
      gender,
      birthdate,
      nationality,
      city,
      hash,
      email,
    ];

    dbConnection.query(userInfoQuery, values, function (err, infoResults) {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).json({ message: "Error inserting user info" });
      }

      console.log("User info inserted successfully");
      return res.status(200).json({ message: "Values inserted successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  console.log("Request received for /login");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const getUserQuery = `
    SELECT users.id, users.email, users.password, users.fullName, users.photoUrl, users.number, users.gender, users.birthdate, users.nationality, users.city, email.otp
    FROM users
    INNER JOIN email ON users.email = email.email
    WHERE users.email = ? 
  `;

  dbConnection.query(getUserQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "An error occurred" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful", user });
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
