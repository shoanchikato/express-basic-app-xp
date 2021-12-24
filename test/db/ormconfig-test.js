const postModel = require("../../src/model/post.model");
const sessionModel = require("../../src/model/session.model");
const userModel = require("../../src/model/user.model");

const testDbConnection = {
  type: "sqlite",
  database: `:memory:`,
  synchronize: true,
  entities: [userModel, postModel, sessionModel],
  migrations: ["migration/*.js"],
  cli: {
    migrationsDir: "migration",
  },
};

module.exports = testDbConnection;
