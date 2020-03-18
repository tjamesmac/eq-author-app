const { v4: uuidv4 } = require("uuid");
const createExpression = require("./createExpression");

module.exports = input => ({
  id: uuidv4(),
  operator: "And",
  expressions: [createExpression()],
  ...input,
});
