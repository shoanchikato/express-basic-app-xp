const EntitySchema = require("typeorm").EntitySchema;

const RoleModel = new EntitySchema({
  name: "Role", // Will use table name `category` as default behaviour.
  tableName: "roles", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    // id: {
    //     primary: true,
    //     type: "int",
    //     generated: true
    // },
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
  relations: {
    permissions: {
      target: "Permission",
      type: "many-to-many",
      // joinColumn: "action", // this decorator is optional for @ManyToOne, but required for @OneToOne
      joinTable: true,
      cascade: true,
    },
  },
});

module.exports = RoleModel;
