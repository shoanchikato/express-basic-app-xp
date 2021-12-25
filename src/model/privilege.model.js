const EntitySchema = require("typeorm").EntitySchema;

const PrivilegeModel = new EntitySchema({
  name: "Privilege", // Will use table name `category` as default behaviour.
  tableName: "privileges", // Optional: Provide `tableName` property to override the default behaviour for table name.
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

module.exports = PrivilegeModel;
