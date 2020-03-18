const { v4: uuidv4 } = require("uuid");
const { createQuestionnaire } = require("../db/datastore");

module.exports = async (req, res) => {
  const input = req.body;
  input.id = uuidv4();
  input.createdAt = new Date();
  input.createdBy = req.user.id;
  input.editors = [];
  const savedQuestionnaire = await createQuestionnaire(input, {
    user: req.user,
  });
  res.json({
    id: savedQuestionnaire.id,
  });
};
