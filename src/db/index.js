const typeorm = require("typeorm");

const dbFactory = (dbConnection) => typeorm.createConnection(dbConnection);

module.exports = dbFactory;
