const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  UnauthorizedRequestError,
} = require("./errors");

const errorHandler = (err, req, res, next) => {
  switch (true) {
    case err instanceof NotFoundError:
      res.status(404).send({ error: { message: err.message } });
      console.error(`NotFoundError error \n\n${err.stack}\n\n`);
      break;

    case err instanceof BadRequestError:
      if (err.validation.length) {
        const { message, validation } = err;
        res.status(400).send({ error: { message, validation } });
      } else {
        res.status(400).send({ error: { message: err.message } });
      }

      console.error(
        `BadRequestError error \n\n${err.stack}` +
          `\n\nvaldiation:${err.validation}` +
          `\n\nbody: ${JSON.stringify(err.reqBody)}\n\n`
      );
      break;

    case err instanceof UnauthorizedRequestError:
      res.status(500).send({ error: { message: err.message } });
      console.error(`UnauthorizedRequestError error \n\n${err.stack}\n\n`);
      break;

    case err instanceof InternalServerError:
      res.status(500).send({ error: { message: err.message } });
      console.error(`InternalServerError error \n\n${err.stack}\n\n`);
      break;

    default:
      res.status(500).send({ error: "sorry, something went wrong" });
      console.error(`InternalServerError error \n\n${err.stack}\n\n`);
      break;
  }
};

module.exports = errorHandler;
