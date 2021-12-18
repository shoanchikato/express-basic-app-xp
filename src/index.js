const appFactory = require("./di");

const port = process.env.PORT || 3000;

async function main() {
  const app = await appFactory();

  app.listen(port, () => console.log(`listening on port ${port}`));
}

main();
