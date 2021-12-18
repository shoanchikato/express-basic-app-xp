const path = require("path");
const typeorm = require("typeorm");

const root = path.resolve(__dirname, "..");

const dbConnection = require("./ormconfig");

module.exports = () => typeorm.createConnection(dbConnection);
