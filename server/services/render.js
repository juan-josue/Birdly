// This library lets you make HTTP requests (get, post, put, delete) from node js
const axios = require("axios");

exports.homeRoutes = (req, res) => {
  if (!req.query) {
    return res
      .status(400)
      .send({ message: "You must fill in the form with an valid email!" });
  }

  const {email } = req.query;
  if (!email) {
    res.render("sign_in");
    return;
  }

  // Make a get request to /api/users
  axios
    .get("http://localhost:3000/api/users?id=" + "63e31bac753a368a40e60fa7")
    .then(function (response) {
      console.log(response.data);
      res.render("index", { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  res.render("update_user");

  // axios.get('http://localhost:3000/api/users', {params: {id: req.query.id}})
  //     .then(function (userdata) {
  //         res.render('update_user', {user: userdata.data})
  //     })
  //     .catch(err => {
  //         res.send(err);
  //     })
};

exports.sign_in = (req, res) => {
  res.render("sign_in");
};
