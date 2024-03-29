const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "User", // Will use table name `category` as default behaviour.
  tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    uuid: {
      type: "varchar",
      generated: "uuid",
      unique: true,
    },
    name: {
      type: "varchar",
    },
    last_name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      // nullable: true,
      unique: true,
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    role: {
      target: "Role",
      type: "many-to-many",
      // joinColumn: "action", // this decorator is optional for @ManyToOne, but required for @OneToOne
      joinTable: true,
      cascade: true,
    },
  },
});
