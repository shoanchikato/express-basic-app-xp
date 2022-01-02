const getIdParam = (reqParams) => {
  const id = parseInt(reqParams.id);

  if (!id) {
    throw new BadRequestError({ message: `invalid user id ${reqParams.id}` });
  }

  return id;
};

module.exports = { getIdParam };
