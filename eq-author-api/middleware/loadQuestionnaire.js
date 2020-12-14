const { getQuestionnaire } = require("../db/datastore");

module.exports = async (req, res, next) => {
  // not getting the id
  console.log("\n\n");
  console.log(req);
  console.log("\n\n");
  // const questionnaireId = req.header("questionnaireId");
  const questionnaireId = "7ff10742-069f-466f-8e5d-d23b371db9d5";
  if (!questionnaireId) {
    next();
    return;
  }

  const questionnaire = await getQuestionnaire(questionnaireId);

  // const isAdmin = get(req, "user.admin", false);
  // if (isAdmin) {
  //   req.questionnaire = questionnaire;
  //   next();
  //   return;
  // }

  // if (questionnaire && questionnaire.isPublic === false) {
  //   const userId = req.user.id;
  //   const authorizedUsers = [questionnaire.createdBy, ...questionnaire.editors];

  //   // if (!authorizedUsers.includes(userId)) {
  //   //   res.status(403).send("Unauthorized questionnaire access");
  //   //   return;
  //   // }
  // }

  req.questionnaire = questionnaire;
  next();
};
