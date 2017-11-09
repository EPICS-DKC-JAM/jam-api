var express = require('express');
var router = express.Router();
var responseBuilder = require('./responseBuilder');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var exports = module.exports = router;


// Mongo Declarations
var SizeSchema = new mongoose.Schema({
    'sizes': Array
});

SizeSchema.plugin(autoIncrement.plugin, 'Size');
var Size = mongoose.model('Size', SizeSchema);

router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = exports.saveSize(data);
    response.json({'data': data, 'success': status})
});

// Upsert Size
router.post('/upsert', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var query = {'_id': data._id};

    if (!data._id) {
        var status = exports.saveSize(data);
        var payload = responseBuilder.buildResponse(response, null, false);

        payload = responseBuilder.buildResponse(response, data, true);
        response.json(payload)
    } else {
        Size.findOneAndUpdate(query, data, {upsert: false}, function (err, doc) {
            var payload = responseBuilder.buildResponse(response, err, false);

            if (err) {
                response.json(payload)
            } else {
                payload = responseBuilder.buildResponse(response, data, true);
                response.json(payload)
            }
        });
    }
});

router.get('/get/:id', function (request, response) {
    if (request.params.id == 'all') {
        Size.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        Size.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    }
});

router.get('/delete/:id', function(request, response) {
    var query = {'_id': id};
    Size.remove(query, function (err, result) {
        if (err) {
            console.log(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
});

router.get('/testAdd', function (req, res) {

    var sizes = {
        'sizes': ['small', 'medium', 'large']
    };

    exports.saveSize(sizes);

    res.json({'status': 'OK'})
});


// Sizes Controller Calls
exports.getSizeById = function (id, callback) {
    Size.findById(id, function (err, result) {
        if (err) {
            console.error(err);
            return null;
        }

        callback(result)
    });
};


exports.saveSize = function (size) {
    var SizeToSave = new Size(size);
    SizeToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(size);
            return true;
        }
    });
};

