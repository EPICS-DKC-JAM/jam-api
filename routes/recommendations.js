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


// Questions for Help Me Decide
var QuestionSchema = new mongoose.Schema({
    _id: String,
    prompt: String,
    options: Array,
    questionOrder: Number
});

// Concatenated answer string for retrieving products from backend
var AnswerSchema = new mongoose.Schema({
    _id: String,
    key: String,
    consumableId: Number // item that corresponds to key value
});

var Question = mongoose.model('Question', QuestionSchema);
var Answer = mongoose.model('Answer', AnswerSchema);

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

/**
 * Returns a multi-dimensional array containing the questions, answers, and items from the CSV
 */
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
        var questions = lines[0].split(",");
        if (questions.length == 0) {
            console.log("File does not contain questions");
            callback(null);
        }

        questions.splice(0, 1);
        removeExtraEmptyItems(questions);

        var parsed = new Array(lines.length - 2); // do not add OPTIONS and ITEMS lines
        parsed[0] = questions;
        var i = 2;
        for (var len = lines.length; i < len && !lines[i].startsWith("ITEMS"); i++) {
            var options = lines[i].split(",").slice(1);
            removeExtraEmptyItems(options);
            parsed[i - 1] = options;
        }

        if (i >= lines.length) {
            console.log("File does not contain ITEMS line");
            callback(null); // file does not contain ITEMS
        }

        i++;
        for (var len = lines.length; i < len; i++) {
            var itemAndAnswers = lines[i].split(",");
            removeExtraEmptyItems(itemAndAnswers);
            parsed[i - 2] = itemAndAnswers;
        }

        callback(parsed);
    });

}

function removeExtraEmptyItems(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        if (items[i].length == 0 || items[i].startsWith("\r")) {
            items.splice(i, 1); // remove blank questions at end
        } else {
            break;
        }
    }
}

router.get('/upload', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    Answer.remove(); // clear out old answers
    Question.remove(); // clear out old questions
    var cwd = path.dirname(fs.realpathSync(__filename));
    var fileName = cwd + '/dummy.csv';
    parseCSV(fileName, function(parsed) {
        if (parsed != null) {
            var i;
            for (i = 0; i < parsed[0].length; i++) {
                var question = {};
                question.prompt = parsed[0][i].trim();
                question.options = parsed[i + 1];
                question.questionOrder = i;
                saveQuestion(question);
            }
            for (i = i + 1; i < parsed.length; i++) {
                var answer = {};
                answer.consumableId = Number(parsed[i][0]);
                answer.key = "";
                for (var j = 1; j < parsed[i].length; j++) {
                    answer.key += parsed[i][j];
                }
                saveAnswer(answer);
            }
        }
    });
    response.json(responseBuilder.buildResponse(response, 'it worked yo', 'success'));
});

/**
 * Get all questions for displaying on the frontend
 */
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

/**
 * Get answers based on responses to questions on 'Help Me Decide' form
 */
router.get('/answers/get/:key', function (request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    var query = {'key': request.params.key};
    Answer.find(query, function (err, result) {
        if (err) {
            console.error(err);
            response.json({'data': null, 'success': false})
        }
        response.json({'data': result, 'success': true})
    });
});

/**
 * Remove an answer / all answers from the database
 */
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

/**
 * Remove a question / all questions from the database
 */
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

module.exports = router;