const { MONGO_URL, dbName } = require("./mongoDB");
const { JWT_SECRET, oauth } = require("./jwt");
module.exports = {
    MONGO_URL, dbName, JWT_SECRET, oauth
}