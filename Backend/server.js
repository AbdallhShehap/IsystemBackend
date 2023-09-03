//Import Modules
const express = require("express");
const cors =require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require("axios");
const loginRoute = require('./Router/loginRoute');
const signupRoute = require('./Router/SignupRoute');

const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const PORT = process.env.PORT ;




const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());




// Use the login route
app.use('/login', loginRoute);

// Use the signup route
app.use('/signup', signupRoute);


app.get('/', (req, res) => {
    res.send('Welcome to the Isystem e-commerce ');
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


