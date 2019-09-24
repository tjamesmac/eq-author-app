const Ajv = require("ajv");
const { get, uniqBy, map } = require("lodash");

const schemas = require("./schemas");
const {
  PAGES,
  OPTIONS,
  ANSWERS,
  SECTIONS,
  CONFIRMATION,
  CONFIRMATION_OPTION,
  VALIDATION,
  MIN_VALUE,
  MAX_VALUE,
} = require("../../constants/validationErrorTypes");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });
require("ajv-errors")(ajv);
require("./customKeywords")(ajv);
require("ajv-keywords")(ajv, "select");

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const convertObjectType = objectType => {
  switch (objectType) {
    case "additionalAnswer":
      return ANSWERS;

    case MIN_VALUE:
    case MAX_VALUE:
      return VALIDATION;

    case "positive":
    case "negative":
      return CONFIRMATION_OPTION;

    default:
      return objectType;
  }
};

module.exports = questionnaire => {
  validate(questionnaire);

  if (!validate.errors) {
    return {
      [ANSWERS]: {},
      [PAGES]: {},
      [OPTIONS]: {},
      [SECTIONS]: {},
      [CONFIRMATION]: {},
      [CONFIRMATION_OPTION]: {},
      [VALIDATION]: {},
      totalCount: 0,
    };
  }

  const errorMessages = validate.errors.filter(
    err => err.keyword === "errorMessage"
  );

  console.log(errorMessages);

  const transformedMessages = uniqBy(errorMessages, "dataPath")
    .map(error => {
      const dataPath = error.dataPath.split("/");

      const fieldname = dataPath.pop();

      let objectType = dataPath[dataPath.length - 1];
      if (!isNaN(objectType)) {
        // Must be in array of object type so get object type
        // e.g. /sections/0/pages/0/answers/0/options/0/label
        objectType = dataPath[dataPath.length - 2];
      }

      const contextPath = dataPath.slice(1).join(".");

      const contextObj = get(questionnaire, contextPath);
      return {
        id: `${objectType}-${contextObj.id}-${fieldname}`,
        entityId: contextObj.id,
        type: convertObjectType(objectType),
        field: fieldname,
        errorCode: error.message,
        dataPath: dataPath.slice(1),
      };
    })
    .reduce(
      (structure, error) => {
        const { entityId, type, dataPath } = error;
        const errorInfo = structure[type][entityId] || {
          id: entityId,
          totalCount: 0,
          errors: [],
        };
        structure[type][entityId] = {
          ...errorInfo,
          totalCount: errorInfo.totalCount + 1,
          errors: [...errorInfo.errors, error],
        };

        const isChildOfPage =
          dataPath[0] === "sections" &&
          dataPath[2] === "pages" &&
          dataPath.length > 5;

        if (isChildOfPage) {
          const sectionIndex = parseInt(dataPath[1], 10);
          const pageIndex = parseInt(dataPath[3], 10);

          const page = questionnaire.sections[sectionIndex].pages[pageIndex];

          let errorInfo = {
            id: page.id,
            totalCount: 0,
            errors: [],
          };

          let pageType = PAGES;
          let pageId = page.id;

          if (dataPath[4] === "confirmation") {
            pageType = CONFIRMATION;
            pageId = page.confirmation.id;
            errorInfo.id = pageId;
          }

          if (structure[pageType][pageId]) {
            errorInfo = structure[pageType][pageId];
          }

          structure[pageType][pageId] = {
            ...errorInfo,
            totalCount: errorInfo.totalCount + 1,
          };
        }

        map(structure[VALIDATION], ({ errors }) => {
          if (errors.message === "ERR_MIN_LARGER_THAN_MAX") {
            structure.totalCount = structure.totalCount - 0.5;
          }
        });

        return structure;
      },
      {
        [ANSWERS]: {},
        [PAGES]: {},
        [OPTIONS]: {},
        [SECTIONS]: {},
        [CONFIRMATION]: {},
        [CONFIRMATION_OPTION]: {},
        [VALIDATION]: {},
        totalCount: errorMessages.length,
      }
    );
  return transformedMessages;
};
