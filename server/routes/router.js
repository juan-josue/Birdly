// Need to require express because we don't have it like in server.js
const express = require("express");

// We don't create another const app because we don't wanna overwrite the one in server.js
const route = express.Router();

const services = require('../services/render');
const controller = require('../controller/controller');

/**
 * @description Root Route (render sign in page)
 * @method GET /
 * */
route.get("/", services.sign_in);
route.get("/sign-in", services.sign_in);

/**
 * @description Log In Route (render sign in page)
 * @method POST /
 * */
route.post("/login", services.login);

/**
 * @description Log In Route (render sign in page)
 * @method GET /
 * */
route.get("/logout", services.logout);

/**
 * @description dashboard Route (render the user dashboard)
 * @method GET /
 * */
route.get("/dashboard", services.dashboard);

/**
 * @description Add User Route (render add user page)
 * @method GET /add-user
 * */
route.get("/add-user", services.add_user);

/**
 * @description Update User Route (render update user page)
 * @method GET /update-user
 * */
route.get("/update-user", services.update_user);

//API (for our api calls to mongodb), :id is defining a url parameter
route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.put('/api/users/:id', controller.update);
route.delete('/api/users/:id', controller.delete);

module.exports = route;