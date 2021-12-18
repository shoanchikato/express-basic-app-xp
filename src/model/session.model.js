const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Session", // Will use table name `category` as default behaviour.
  tableName: "session", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "varchar",
    },
    expiredAt: {
      type: "bigint",
    },
    json: {
      type: "varchar",
    },
  },
});
