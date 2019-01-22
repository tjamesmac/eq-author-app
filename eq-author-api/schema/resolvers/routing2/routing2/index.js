const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const { flatMap, find, set, flow } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");
const createRouting = require("../../../../src/businessLogic/createRouting");
const createDestination = require("../../../../src/businessLogic/createDestination");
const getNextDestination = require("../../../../src/businessLogic/getNextDestination");

const Resolvers = {};

Resolvers.Routing2 = {
  else: routing => routing.else,
  page: ({ id }, args, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    return find(page => {
      if (page.routing && page.routing.id === id) {
        return page;
      }
    }, pages);
  },
  rules: routing => routing.rules,
};

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const page = find({ id: input.pageId }, pages);

    if (page.routing) {
      throw new Error("Can only have one Routing per Page.");
    }

    const nextDestination = getNextDestination(ctx.questionnaire, page.id);

    page.routing = set(
      "rules.0.expressionGroup.expressions.0.left.nullReason",
      "NoRoutableAnswerOnPage",
      set(
        "rules.0.expressionGroup.expressions.0.left.type",
        "Null",
        set(
          "rules.0.destination",
          createDestination(nextDestination),
          createRouting({
            else: createDestination(nextDestination),
          })
        )
      )
    );
    save(ctx.questionnaire);
    return page.routing;
  },
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    return ctx.modifiers.Routing.update({
      id: input.id,
      else: input.else,
    });
  },
};

module.exports = Resolvers;
