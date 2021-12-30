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
    permission_status: {
      type: "varchar",
    },
  },
  relations: {
    privileges: {
      target: "Privilege",
      type: "many-to-many",
      joinTable: true,
      cascade: true,
    },
  },
});

module.exports = PermissionModel;
