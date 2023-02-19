// This library lets you make HTTP requests (get, post, put, delete) from node js
const axios = require("axios");
const bcrypt = require("bcrypt");

// login route handler
exports.login = (req, res) => {
  axios
    .get("http://localhost:3000/api/users", {
      params: { email: req.body.email },
    })
    .then( async function (response) {
      const user = response.data;

      if (!user) {
        res.render("sign_in", { logout: "No accounts associated with this email!" });
      }
      // Use becrypt to comapre hashed password to entered password
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          req.session.user = user;
          res.redirect("/dashboard");
        }
      } catch {
        res.render("sign_in", { logout: "Invalid username or password!" });
      }
    })
    .catch((err) => {
      res.render("sign_in", { logout: "Something went wrong during sign in!" });
    });
};

// logout route handler
exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.send("Error");
    } else {
      res.render("sign_in", { logout: "You logged out successfully!" });
    }
  });
};

// Dashboard route handler
exports.dashboard = (req, res) => {
  if (req.session.user) {
    res.render("index", { user: req.session.user });
  } else {
    res.send("Unauthorized user!");
  }
};

exports.sign_in = (req, res) => {
  res.render("sign_in");
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  res.render("update_user");
};

