var Userdb = require("../model/model");
const bcrypt = require("bcrypt");

// login route handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await Userdb.findOne({ email });

    if (!user) {
      throw new Error("No accounts associated with this email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (error) {
    res.render("sign_in", { logout: error.message });
  }
};

// Create and save new user
exports.create = async (req, res) => {
  try {
    // create a new user object with hashed password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new Userdb({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      sightings: [],
    });

    // save the user object to the database
    const savedUser = await user.save();

    // set session user to the saved user
    req.session.user = savedUser;

    // redirect to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating a create operation!",
    });
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
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Data to update cannot be empty");
    }

    const id = req.params.id;
    const updatedUser = await Userdb.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error(`User not found with id ${id}`);
    }

    req.session.user = updatedUser;
    res.send(updatedUser);
    res.redirect("/dashboard");
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(404).send({ message: `Cannot update user with id ${id}. Maybe user not found!` });
    } else {
      res.status(500).send({ message: "Error updating user info" });
    }
  }
};


// Delete a user with specified id in the request
exports.delete = async (req, res) => {
  try {
    const sightingId = req.body.sightingId;

    if (!sightingId) {
      return res.status(400).send({ message: "Sighting ID is required" });
    }

    const user = req.session.user;

    const updatedUser = await Userdb.findOneAndUpdate(
      { _id: user._id },
      { $pull: { sightings: { _id: sightingId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found with id " + user._id,
      });
    }

    req.session.user = updatedUser;
    res.render("index", { user: updatedUser });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting sighting",
    });
  }
};

// report sighting
exports.report = (req, res) => {
  const user = req.session.user;
  const newSighting = req.body.sighting;
  console.log(req.body.sighting);

  if (user) {
    // Find user with the id and update
    Userdb.findByIdAndUpdate(
      user._id,
      {
        $push: {
          sightings: {
            coords: newSighting.coords,
            date: newSighting.date,
            time: newSighting.time,
            species: newSighting.species,
            location: newSighting.locationType,
          },
        },
      },
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
