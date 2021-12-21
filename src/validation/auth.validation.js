const Joi = require("joi-plus");
const joiValidationOptions = require("./joiValidationOptions");

const validateUser = async (data) => {
  const schema = Joi.object({
    name: Joi.string().escape().required(),
    last_name: Joi.string().escape().required(),
    email: Joi.string().escape().required(),
    password: Joi.string().escape().required(),
  }).options(joiValidationOptions);

  const { value, error } = await schema.validate(data);

  return { value, error };
};

const validateCredentials = async (data) => {
  const schema = Joi.object({
    username: Joi.string().escape().required(),
    password: Joi.string().escape().required(),
    _csrf: Joi.string(),
  }).options(joiValidationOptions);

  const { value, error } = await schema.validate(data);

  return { value, error };
};

module.exports = { validateUser, validateCredentials };
