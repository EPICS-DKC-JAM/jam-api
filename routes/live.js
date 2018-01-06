var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var responseBuilder = require('./responseBuilder');
var autoIncrement = require('mongoose-auto-increment');
var sizes = require('./sizes');
var modifiers = require('./modifiers');
var jsonify = require('jsonify');


router.get('/', function (req, res, next) {
    res.io.emit("socketToMe", "users");
    res.send('respond with a resource.');
});


router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var payload = responseBuilder.buildResponse(response, null, false);

    payload = responseBuilder.buildResponse(response, data, true);
    response.json(payload)
});

module.exports = router;
