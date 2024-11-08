const getApi = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

const createSomethingApi = (req, res) => {
  res.json({
    message: "create World",
  });
};

export { getApi, createSomethingApi };
