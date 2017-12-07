var express = require('express');
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');
var responseBuilder = require('./responseBuilder');
var autoIncrement = require('mongoose-auto-increment');
var sizes = require('./sizes');
var modifiers = require('./modifiers');
var jsonify = require('jsonify');
var path = require('path');
var multer = require('multer');



/** Questions for Help Me Decide **/
var QuestionSchema = new mongoose.Schema({
    _id: String,
    prompt: String,
    options: Array,
    questionOrder: Number
});

/** Concatenated answer string for retrieving products from backend **/
var AnswerSchema = new mongoose.Schema({
    _id: String,
    keys: [],
    consumableId: Number // item that corresponds to key value
});

var Question = mongoose.model('Question', QuestionSchema);
var Answer = mongoose.model('Answer', AnswerSchema);
var Multer = multer({dest: 'uploads/'});

/** Get all questions for displaying on the frontend **/
router.get('/questions/get', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    Question.find(function (err, result) {
        if (err) {
            console.error(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
});

/** Get answers based on responses to questions on 'Help Me Decide' form **/
router.get('/answers/get/', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    Answer.find(function (err, result) {
        if (err) {
            console.error(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
});

/** Remove an answer / all answers from the database **/
router.get('/answers/delete/:id', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    if (request.params.id == 'all') {
        Answer.remove(function (err, result) {
            if (err) {
                console.log(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        var query = {'_id': id};
        Answer.remove(query, function (err, result) {
            if (err) {
                console.log(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    }
});

/** Remove a question / all questions from the database **/
router.get('/questions/delete/:id', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    if (request.params.id == 'all') {
        Question.remove(function (err, result) {
            if (err) {
                console.log(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    } else {
        var query = {'_id': id};
        Question.remove(query, function (err, result) {
            if (err) {
                console.log(err);
                response.json({'data': null, 'success': false})
            }
            response.json({'data': result, 'success': true})
        });
    }
});

/** Upload an excel document with questions and answers to be parsed **/
router.post('/upload', Multer.single('file'), function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    Answer.remove(); // clear out old answers
    Question.remove(); // clear out old questions
    //var cwd = path.dirname(fs.realpathSync(__filename));
    var fileName = request.file.path;
    parseCSV(fileName, function(parsed) {
        if (parsed != null) {
            console.log(parsed);
            var i, itemsStart;
            var numQuestions = parsed[0].length;
            console.log("NUM QUESTIONS: " + numQuestions);
            for (i = 0; i < numQuestions; i++) {
                /** Iterate through options for each question until "ITEMS" row is hit **/
                var options = [];
                for (j = 2; j < parsed.length; j++) {
                    if (parsed[j][0].startsWith("ITEMS")) {
                        itemsStart = j + 1;
                        break;
                    }
                    options.push(parsed[j][i + 1]);
                }
                var question = {};
                question.prompt = parsed[0][i];
                question.options = options;
                question.questionOrder = i;
                saveQuestion(question);
            }
            for (i = itemsStart; i < parsed.length; i++) {
                var keys = new Array();
                for (var j = 1; j < parsed[i].length; j++) {
                    keys.push(parsed[i][j]);
                }
                var answer = {};
                answer.consumableId = Number(parsed[i][0]);
                answer.keys = keys;
                saveAnswer(answer);
            }
        }
    });
    response.json(responseBuilder.buildResponse(response, 'document has been parsed', 'success'));
});

/** Save a question to the database **/
function saveQuestion(question) {
    var questionToSave = new Question(question);
    questionToSave._id = questionToSave.prompt; // set prompt as primary key
    questionToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(questionToSave);
            return true;
        }
    });
}

/** Save an answer to the database **/
function saveAnswer(answer) {
    var answerToSave = new Answer(answer);
    answerToSave._id = answerToSave.consumableId; // set consumable id as primary key
    answerToSave.save(function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(answerToSave);
            return true;
        }
    });
}

/** Returns a multi-dimensional array containing the questions, answers, and items from the CSV */
function parseCSV(fileName, callback) {
    fs.readFile(fileName, 'utf8', function (err,data) {
        if (err) {
            console.log(err);
            callback(null);
        }
        if (data == null || data.length == 0) {
            console.log("No data read from file");
            callback(null); // file not found or error reading file
        }
        var lines = data.split("\n");
        var parsed = new Array(lines.length); // do not add OPTIONS and ITEMS lines
        for (i = 0; i < lines.length; i++) {
            lines[i] = lines[i].trim(); // remove return carriages
            var values = lines[i].split(",");
            removeEmptyItems(values);
            parsed[i] = new Array(values.length);
            for (j = 0; j < values.length; j++) {
                parsed[i][j] = values[j].trim();
            }
        }
        callback(parsed);
    });
}

/** Remove empty strings from a string array **/
function removeEmptyItems(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        if (items[i].length == 0 || items[i].startsWith("\r")) {
            items.splice(i, 1); // remove blank questions at end
        }
    }
}

module.exports = router;
