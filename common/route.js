// ./express-server/routes/notes.server.route.js
var express = require("express");


var bodyParser = require('body-parser')

//import controller file
//import * as commonController from '../controllers/common.server.controller';
var commonController = require('./controler');

// get an instance of express router
const app = express();

// handle json data
app.use(bodyParser.json())

// handle URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }))

// common route
// app.route('/common/search').post(commonController.getAllItems);
app.route('/').post(commonController.getAllItems)
app.route('/add').post(commonController.addAnItem)
app.route('/delete')
    .post(commonController.removeAnItem)
// .get(notesController.getNotes);
app.route('/update')
    .post(commonController.updateAnItem)


module.exports = app;