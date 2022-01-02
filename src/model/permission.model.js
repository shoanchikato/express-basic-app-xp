const EntitySchema = require("typeorm").EntitySchema;

const PermissionModel = new EntitySchema({
  name: "Permission", // Will use table name `category` as default behaviour.
  tableName: "permissions", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    base_url: {
      type: "varchar",
    },
    path: {
      type: "varchar",
    },
    method: {
      type: "varchar",
    },
    entity: {
      type: "varchar",
    },
    action: {
      type: "varchar",
    },
  },
});

module.exports = PermissionModel;
