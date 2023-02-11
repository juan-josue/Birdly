// This library lets you make HTTP requests (get, post, put, delete) from node js
const axios = require("axios");

// login route handler
exports.login = (req, res) => {
  axios
    .get("http://localhost:3000/api/users", {
      params: { email: req.body.email },
    })
    .then(function (response) {
      const user = response.data;

      if (user.email && req.body.email == user.email) {
        req.session.user = user;
        res.redirect("/dashboard");
      } else {
        res.render("sign_in", { logout: "Invalid username or password!" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

// logout route handler
exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("sign_in", { logout: "You logged out successfully!" });
    }
  });
};

// Dashboard route handler
exports.dashboard = (req, res) => {
  console.log(req.session);
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

// axios.get('http://localhost:3000/api/users', {params: {id: req.query.id}})
//     .then(function (userdata) {
//         res.render('update_user', {user: userdata.data})
//     })
//     .catch(err => {
//         res.send(err);
//     })

//   axios.get("http://localhost:3000/api/users?id=" + "63e31bac753a368a40e60fa7")
//   .then(function (response) {
//     console.log(response.data);
//     res.render("index", { users: response.data });
//   })
//   .catch((err) => {
//     res.send(err);
//   });
