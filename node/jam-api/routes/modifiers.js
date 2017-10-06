var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoUrl = 'mongodb://localhost:27017/jam';

mongoose.connect(mongoUrl);
autoIncrement.initialize(mongoose);

var ModifierSchema = new mongoose.Schema({
    'modifiers': Array
});

ModifierSchema.plugin(autoIncrement.plugin, 'Modifier');
var Modifier = mongoose.model('Modifier', ModifierSchema);

router.post('/add', function (request, response) {
    console.log(request.body);
    var data = request.body.data;
    var status = saveModifier(data);
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

    saveModifier(modifiers);

    res.json({'status': 'OK'})
});

function getModifierById(id) {
    Modifier.findById(id, function (err, result) {
        if (err) {
            console.error(err);
            return null;
        }
        return result
    });
}


function saveModifier(modifier) {
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
}

module.exports = router;
