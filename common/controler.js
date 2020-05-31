
const {  getAllItems, updateAnItem, addValidItem, removeAnItem, removeById } = require("../crudOperatons");


if (process.env.NODE_ENV === 'test') {
    dbName = dbName + "Test";
}

const Joi = require('joi');
const { getSchema } = require("../schema/index");
// schema used for data validation for our test document
// const schema = Joi.object().keys({
//     options: {
//         collection: Joi.string().required(),
//         schema:"testSchema",
//         data: {
//             name: Joi.string(),
//             description: Joi.string()
//         }
//     }
// });

function addAnItem(req, res, next) {
    // console.log("add");
    var clientInput = req.body.options;
    Joi.validate(clientInput.data, getSchema(clientInput.schema), (err, result) => {
        if (err) {
            console.log("err");
            console.log(err.details);
            const error = new Error("Invalid Input"); //can include moragan for this 
            error.status = 400;
            error.validate = false;
            error.details = err.details;
            next(error);
        } else {
            addValidItem(req, res);
        }
    });
}

module.exports = { getAllItems, updateAnItem, addAnItem, removeAnItem, removeById };