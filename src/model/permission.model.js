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
  },
  relations: {
    action: {
      target: "Action",
      type: "many-to-many",
      // joinColumn: "action", // this decorator is optional for @ManyToOne, but required for @OneToOne
      joinTable: true,
      cascade: true,
    },
  },
});

module.exports = PermissionModel;
