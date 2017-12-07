var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var responseBuilder = require('./responseBuilder');
var autoIncrement = require('mongoose-auto-increment');
var sizes = require('./sizes');
var modifiers = require('./modifiers');
var jsonify = require('jsonify');
var multer = require('multer');
var fs = require('fs');

var ImageSchema = new mongoose.Schema({
    'name': String,
    'data': Buffer,
    'contentType': String
});

// DEPCREATED, DEVELOPMENT STOPPED MOVING TO S3

var Image = mongoose.model('Image', ImageSchema);
var Multer = multer({dest: 'images/'});

router.post('/add', Multer.single('image'), function (request, response) {
    console.log('Adding picture');
    console.log(request.body);

    var image = new Image;
    image.data = fs.readFileSync(request.file.path);
    image.contentType = request.file.mimetype;
    image.name = request.body.name;

    image.save(function (err) {
        if (err) {
            console.log(err);
            response.json({'data': null, 'success': false})
        }
        else {
            console.log('Saved Image');
            response.json({'data': image.name, 'success': true})
        }
    });
});

router.get('/get/:name', function (request, response) {
    var payload = responseBuilder.buildResponse(response, null, false);

    if (request.params.name == 'all') {
        Image.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            response.contentType(result.contentType);
            response.send(result.data);
        });
    } else {
        Image.find({name: request.params.name}, function (err, result) {
            if (err) {
                console.error(err);
                response.json(payload)
            }
            response.mimeType = result[0].contentType;
            console.log(response)
            response.send(result[0].data.toString('base64'));
        });
    }
});

module.exports = router;