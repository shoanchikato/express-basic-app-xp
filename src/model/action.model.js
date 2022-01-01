const EntitySchema = require("typeorm").EntitySchema;

const ActionModel = new EntitySchema({
  name: "Action", // Will use table name `category` as default behaviour.
  tableName: "actions", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
});

module.exports = ActionModel;
