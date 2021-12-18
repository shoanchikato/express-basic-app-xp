const Joi = require("joi");

const validateUser = async (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).options({ abortEarly: false });

  const { value, error } = await schema.validate(data);

  return { value, error };
};

const validateCredentials = async (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).options({ abortEarly: false });

  const { value, error } = await schema.validate(data);

  return { value, error };
};

module.exports = { validateUser, validateCredentials };
