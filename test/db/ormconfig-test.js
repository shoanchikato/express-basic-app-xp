const path = require("path");
const root = path.resolve(__dirname, "..");

const PermissionModel = require("../../src/model/permission.model");
const PostModel = require("../../src/model/post.model");
const PrivilegeModel = require("../../src/model/privilege.model");
const SessionModel = require("../../src/model/session.model");
const UserModel = require("../../src/model/user.model");

const testDbConnection = {
  type: "sqlite",
  database: `:memory:`,
  // database: `${root}/../sqlite.test.db`,
  // dropSchema: true,
  synchronize: true,
  entities: [
    UserModel,
    PostModel,
    SessionModel,
    PrivilegeModel,
    PermissionModel,
  ],
  migrations: ["migration/*.js"],
  cli: {
    migrationsDir: "migration",
  },
};

module.exports = testDbConnection;
