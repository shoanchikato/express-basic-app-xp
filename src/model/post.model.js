const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Post", // Will use table name `category` as default behaviour.
  tableName: "posts", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    // id: {
    //     primary: true,
    //     type: "int",
    //     generated: true
    // },
    id: {
      primary: true,
      type: "int",
    },
    userId: {
      type: "varchar",
    },
    title: {
      type: "varchar",
    },
    body: {
      type: "varchar",
    },
  },
});
