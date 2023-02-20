var Userdb = require("../model/model");
const axios = require("axios");
const bcrypt = require("bcrypt");

// Create and save new user
exports.create = async (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  // Create a new user based on our model with a hashed and salted password using bcrypt
  try {
    const salt = await bcrypt.genSalt();
    console.log(req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new Userdb({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      sightings: [],
    });

    // Save user in the data base
    user
      .save(user)
      .then((data) => {
        // Send the new user the dashboard
        axios
          .get("http://localhost:3000/api/users", {
            params: { email: req.body.email },
          })
          .then(function (response) {
            req.session.user = response.data;
            res.redirect("/dashboard");
          })
          .catch((err) => {
            res.send(err);
          });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occured while creating a create operation!",
        });
      });
  } catch (error) {
    console.log(error);
  }
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
      console.log("UPDATE SUCCESS SUCCESS UPDATE SUCCESS SUCCESS");
      req.session.user = data;
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
  let sightings = req.session.user.sightings;
  const targetId = req.body.sightingId;

  sightings = sightings.filter((sighting) => sighting._id != targetId);

  Userdb.findByIdAndUpdate(
    req.session.user._id,
    { sightings: sightings },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "User not found with id " + req.session.user._id,
        });
      }
      req.session.user = data;
      res.render("index", { user: data });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error updating sighting list info",
      });
    });
};

// report sighting
exports.report = (req, res) => {
  const user = req.session.user;
  const newSighting = req.body.sighting;

  if (user) {
    // Find user with the id and update
    Userdb.findByIdAndUpdate(
      user._id,
      { $push: { sightings: newSighting } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: "User not found with id " + user._id,
          });
        }
        req.session.user = data; // Update the session user with the updated data
        res.render("index", { user: data });
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: `cannot update user with id:${user._id}. Maybe user not found!`,
          });
        }
        return res.status(500).send({
          message: "Error updating user info",
        });
      });
  } else {
    return res.status(401).send({
      message: "Please sign in to access the page.",
    });
  }
};
