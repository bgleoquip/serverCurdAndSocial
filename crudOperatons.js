const express = require('express');

const app = express();

const { getAggregationArray } = require("aggregation-query");

const {  connection, getDB, connect, getPrimaryKey } = require("./db");

const collection = "todo";
/*
require clientInput: {
    caseSensitive: false;
    collection: collectionName;
    selector: {};
    data: {
    };
    ** model: "";**
    searchFields: [
    ];
    searchText: "";
    data: { };
    uid: null;
    match: { };
    sort: {}; OR null; OR {createdAt: -1}
    limit: null;OR Numeric 
    skip: null;OR Numeric 
    project: null;OR {}
}
*/


// read 
function getAllItems(req, res) {
    console.log(req);
    var clientInput = req.body.options;
    var aggregateArray = getAggregationArray(req);
    var collection = clientInput.collection;
    connection(collection).aggregate(aggregateArray).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            res.json(documents);
        }
    });
}
// update
function updateAnItem(req, res) {
    var clientInput = req.body.options;
    var collection = clientInput.collection;
    connection(collection).findOneAndUpdate(clientInput.selector, { $set: clientInput.data }, function (err, result) {
        if (result) {
            getAllItems(req, res);
        }
        else res.json({ result: result, document: result.ops[0], msg: "Successfully inserted!!!", error: null });
    });

}
// create

function addValidItem(req, res) {
    var clientInput = req.body.options;
    var collection = clientInput.collection;
    connection(collection).insertOne(clientInput.data, function (err, result) {
        if (result) {
            getAllItems(req, res);
        }
        else res.json({ result: result, document: result.ops[0], msg: "Successfully inserted!!!", error: null });
    });
}

// delete    need to work on multiple delete
function removeAnItem(req, res) {
    var clientInput = req.body.options;
    var collection = clientInput.collection;
    connection(collection).findOneAndDelete(clientInput.selector, function (err, result) {
        if (result) {
            getAllItems(req, res);
        }
        else res.json({ result: result, document: result.ops[0], msg: "Successfully delted!!!", error: null });
    });

}
// delete by id
function removeById(req, res) {
    var clientInput = req.body.options;
    var collection = clientInput.collection;
    var connection = getDB().collection(collection);
    const docId = req.params.id;
    connection.findOneAndDelete({ _id: getPrimaryKey(docId) }, function (err, result) {
        if (result) {
            getAllItems(req, res);
        }
        else res.json({ result: result, document: result.ops[0], msg: "Successfully delted!!!", error: null });
    });
}


module.exports = {
    connection,
    getAllItems,
    updateAnItem,
    addValidItem,
    removeAnItem,
    removeById
}