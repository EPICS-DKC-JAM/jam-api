var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var mongoUrl = config.mongoUrl;

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the JAM API home page! There is nothing here. No work has been done. Oops.');
});

module.exports = router;
