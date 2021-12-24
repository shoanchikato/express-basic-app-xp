const appFactory = require("./di");
const dbConnection = require("./db/ormconfig");

const port = process.env.PORT || 3000;

async function main() {
  const app = await appFactory(dbConnection);

  app.listen(port, () => console.log(`listening on port ${port}`));
}

main();
