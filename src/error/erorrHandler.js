const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  UnauthorizedRequestError,
} = require("./errors");

const errorHandler = (err, req, res, next) => {
  // csrf error handling
  if (err.code == "EBADCSRFTOKEN") {
    console.error(`CRSF error \n\n${err}\n\n`);
    res.status(403).format({
      text: function () {
        res.send("invalid form request");
      },

      html: function () {
        res.send("<h1>invalid form request</h1>");
      },

      json: function () {
        res.send({ error: "invalid form request" });
      },
    });
    return;
  }

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
      // res.status(500).send({ error: "sorry, something went wrong" });
      res.status(500).format({
        text: function () {
          res.send("sorry, something went wrong");
        },
  
        html: function () {
          res.send("<h1>sorry, something went wrong</h1>");
        },
  
        json: function () {
          res.send({ error: "sorry, something went wrong" });
        },
      });
      console.error(`InternalServerError error \n\n${err.stack}\n\n`);
      break;
  }
};

module.exports = errorHandler;
