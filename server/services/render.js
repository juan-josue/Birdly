// This library lets you make HTTP requests (get, post, put, delete) from node js
const axios = require("axios");

const credential = {
  email: "admin@gmail.com",
  password: "YellowMangoes01",
};

// login route handler
exports.login = (req, res) => {
  if (
    req.body.email == credential.email &&
    req.body.password == credential.password
  ) {
    req.session.user = req.body.email;
    console.log("redirecting to dashboard");
    res.redirect("/dashboard");
  } else {
    res.render('sign_in', { logout : "Invalid username or password!"});
  }
};

// logout route handler
exports.logout = (req ,res)=>{
  req.session.destroy(function(err){
      if(err){
          console.log(err);
          res.send("Error")
      }else{
          res.render('sign_in', { logout : "You logged out successfully!"});
      }
  })
}

// Dashboard route handler
exports.dashboard = (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.render("index", {user : req.session.user});
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
