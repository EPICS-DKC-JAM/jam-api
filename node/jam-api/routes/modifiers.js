var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoUrl = 'mongodb://localhost:27017/jam';
var exports = module.exports = router;


// Mongo declarations
var ModifierSchema = new mongoose.Schema({
    'modifiers': Array
});

ModifierSchema.plugin(autoIncrement.plugin, 'Modifier');
var Modifier = mongoose.model('Modifier', ModifierSchema);


// Modifiers Rest API Calls
router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveModifiers(data);
    response.json({'data': data, 'success': status})
});

router.get('/get/:id', function (request, response) {
    if (request.params.id == 'all') {
        Modifier.find(function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        Modifier.findById(request.params.id, function (err, result) {
            if (err) {
                console.error(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    }
});

router.get('/testAdd', function (req, res) {

    var modifiers = {
        'modifiers': ['mocha', 'vanilla', 'ice', 'no ice']
    };

    saveModifiers(modifiers);

    res.json({'status': 'OK'})
});


// Modifiers Controller Calls
exports.getModifiersById = function (id, callback) {
    Modifier.findById(id, function (err, result) {
        if (err) {
            console.error(err);
            callback(null);
        }
        callback(result)
    });
};


exports.saveModifiers = function (modifier) {
    var ModifierToSave = new Modifier(modifier);
    ModifierToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(modifier);
            return true;
        }
    });
};

