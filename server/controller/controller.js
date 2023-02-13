var Userdb = require("../model/model");

// Create and save new user
exports.create = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  // Create a new user based on our model
  const user = new Userdb({
    name: req.body.name,
    email: req.body.email,
    sightings: [],
  });

  // Save user in the data base
  user
    .save(user)
    .then((data) => {
      res.send(data);
      // res.redirect("/add-user")
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occured while creating a create operation!",
      });
    });
};

// Retrieve a user with a specific email
exports.find = (req, res) => {
  // Retrieve single user (a id query param was included in request)
  if (req.query.email) {
    Userdb.findOne({ email: req.query.email })
      .then((response) => {
        if (!response) {
          res.send();
        } else {
          res.send(response);
        }
      })
      .catch((err) => {
        res.status(500);
      });
  }
};

// Update a new identified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty" });
  }

  const id = req.params.id;
  Userdb.findByIdAndUpdate(id, req.body, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "User not found with id " + id,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: `cannot update user with id:${id}. Maybe user not found!`,
        });
      }
      return res.status(500).send({
        message: "Error updating user info",
      });
    });
};

// Delete a user with specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Userdb.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete user with ${id}. Maybe wrong id?` });
      } else {
        res.send({ message: "User was deleted succesfully!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Cannot Delete user with ${id}. Maybe wrong id?` });
    });
};

// report sighting
exports.report = (req, res) => {
  const user = req.session.user;
  const newSighting = req.body.sighting;
  const id = user._id;

  if (user) {
    // Find user with the id and update
    Userdb.findByIdAndUpdate(
      id,
      { $push: { sightings: newSighting } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: "User not found with id " + id,
          });
        }
        res.render("index", { user: req.session.user });
      })
      .catch((err) => {
        console.log(err);
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: `cannot update user with id:${id}. Maybe user not found!`,
          });
        }
        return res.status(500).send({
          message: "Error updating user info",
        });
      });
  } else {
    console.error("User not found");
  }
};
