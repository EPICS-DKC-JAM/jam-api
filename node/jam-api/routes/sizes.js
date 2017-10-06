var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoUrl = 'mongodb://localhost:27017/jam';

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);

var SizeSchema = new mongoose.Schema({
    'sizes': Array
});

SizeSchema.plugin(autoIncrement.plugin, 'Size');
var Size = mongoose.model('Size', SizeSchema);

router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveSize(data);
    response.json({'data': data, 'success': status})
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

router.get('/testAdd', function (req, res) {

    var sizes = {
        'sizes': ['small', 'medium', 'large']
    };

    saveSize(sizes);

    res.json({'status': 'OK'})
});

function getSizeById(id) {
    Size.findById(id, function (err, result) {
        if (err) {
            console.error(err);
            return null;
        }
        return result
    });
}


function saveSize(size) {
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
}

module.exports = router;
