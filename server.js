// Express is a node framework commonly used to handle HTTP routes (ie get, post, put, delete)
const express = require("express");
// Used to seperate sensitive data (ie ports, passwords, and API keys) from your code and into a .env file
const dotenv = require("dotenv");
// Outputs to the console each HTTP request the server recieves automatically
const morgan = require("morgan");
// Used to parse HTTP request (ie get info like what kind of request is coming in)
const bodyparser = require("body-parser");

// These two are used together to create new sessions and generate id's for the session (used in login)
const session = require("express-session");
const {v4: uuidv4} = require("uuid");

// A built in module that will let you work with dirs and file paths in node js
const path = require("path");


const connectDB = require('./server/database/connection')

// An express object for handling HTTP routes
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(session({
  secret: uuidv4(), // Generates a secret id
  resave: false,
  saveUninitialized: true
}))

// Tells the code where to find the dotenv secret variables
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// Log HTTP requests as tiny summaries to the console
app.use(morgan("tiny"));

//MongoDB connection
connectDB();

// Parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");
// For reference if I decide to have a dedicated folder for ejs files in the views folder
//app.set("views", path.resolve(__dirname, "views/ejs"));

// Load assets (css/style.css - how to use assets example)
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// Load routers
app.use('/', require('./server/routes/router'));

// Tells the app to listen for HTTP requests on x port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});