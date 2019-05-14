import React from "react";
import { Field, Label } from "components/Forms";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import answerFragment from "graphql/fragments/answer.graphql";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import gql from "graphql-tag";

const getFieldMessage = ({ answer, field, enableValidationMessage }) => {
  const messages =
    answer.validationErrorInfo && answer.validationErrorInfo.errors;

  if (!messages || !enableValidationMessage) {
    return false;
  }

  const fieldMessage = messages.find(m => m.field === field);
  return fieldMessage && fieldMessage.message;
};

export const StatelessBasicAnswer = ({
  answer,
  onChange,
  onUpdate,
  children,
  labelPlaceholder,
  labelText,
  descriptionText,
  descriptionPlaceholder,
  showDescription,
  autoFocus,
  enableValidationMessage,
}) => (
  <div>
    <Field>
      <Label htmlFor={`answer-label-${answer.id}`}>{labelText}</Label>
      <WrappingInput
        id={`answer-label-${answer.id}`}
        name="label"
        onChange={onChange}
        onBlur={onUpdate}
        value={answer.label}
        data-autofocus={autoFocus || null}
        placeholder={labelPlaceholder}
        data-test="txt-answer-label"
        bold
      />
      {getFieldMessage({
        answer,
        field: "label",
        enableValidationMessage,
      })}
    </Field>
    {showDescription && (
      <Field>
        <Label htmlFor={`answer-description-${answer.id}`}>
          {descriptionText}
        </Label>
        <WrappingInput
          id={`answer-description-${answer.id}`}
          name="description"
          cols="30"
          rows="5"
          onChange={onChange}
          onBlur={onUpdate}
          value={answer.description}
          placeholder={descriptionPlaceholder}
          data-test="txt-answer-description"
        />
      </Field>
    )}
    {children}
  </div>
);

StatelessBasicAnswer.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  children: PropTypes.element,
  labelText: PropTypes.string,
  labelPlaceholder: PropTypes.string,
  descriptionText: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  showDescription: PropTypes.bool,
  autoFocus: PropTypes.bool,
  enableValidationMessage: PropTypes.bool,
};

StatelessBasicAnswer.defaultProps = {
  labelText: "Label",
  descriptionText: "Description (optional)",
  showDescription: false,
  autoFocus: true,
  enableValidationMessage: true,
};

StatelessBasicAnswer.fragments = {
  Answer: answerFragment,
  BasicAnswer: gql`
    fragment BasicAnswer on BasicAnswer {
      validation {
        ... on NumberValidation {
          minValue {
            enabled
            ...MinValueValidationRule
          }
          maxValue {
            enabled
            ...MaxValueValidationRule
          }
        }
        ... on DateValidation {
          earliestDate {
            enabled
            ...EarliestDateValidationRule
          }
          latestDate {
            enabled
            ...LatestDateValidationRule
          }
        }
      }
    }
    ${MinValueValidationRule}
    ${MaxValueValidationRule}
    ${EarliestDateValidationRule}
    ${LatestDateValidationRule}
  `,
};

export default withEntityEditor("answer")(StatelessBasicAnswer);
