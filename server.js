// Express is a node framework commonly used to handle HTTP routes
const express = require("express"); 

// Used to seperate sensitive data (ie ports, passwords, API keys) from your code
const dotenv = require("dotenv"); 

// Outputs to the console each HTTP request the server recieves automatically
const morgan = require("morgan"); 

// Used to parse HTTP request
const bodyparser = require("body-parser"); 
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