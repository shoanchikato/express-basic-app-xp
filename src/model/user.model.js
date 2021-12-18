const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "User", // Will use table name `category` as default behaviour.
  tableName: "user", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    last_name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      nullable: true,
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
  },
});
