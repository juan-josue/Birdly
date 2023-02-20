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

// Sign in route handler
exports.sign_in = (req, res) => {
  res.render("sign_in");
};

// Add user route handler
exports.add_user = (req, res) => {
  res.render("add_user");
};

// Update User route handler
exports.update_user = (req, res) => {
  if (req.session.user) {
    res.render("update_user", { user: req.session.user });
  } else {
    res.send("Unauthorized user!");
  }
};

