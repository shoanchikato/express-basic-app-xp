const path = require("path");
const root = path.resolve(__dirname, "..");

const UserModel = require("../model/user.model");
const PostModel = require("../model/post.model");
const SessionModel = require("../model/session.model");

const dbConnection = {
  type: "sqlite",
  database: `${root}/../sqlite.db`,
  // database: `:memory:`,
  synchronize: true,
  entities: [UserModel, PostModel, SessionModel],
  migrations: ["migration/*.js"],
  cli: {
    migrationsDir: "migration",
  },
};

module.exports = dbConnection;
