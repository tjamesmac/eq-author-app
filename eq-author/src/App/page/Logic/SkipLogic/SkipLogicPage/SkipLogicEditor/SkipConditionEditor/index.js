/* eslint-disable import/no-unresolved */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { flow, get } from "lodash/fp";

import Transition from "App/page/Logic/Routing/Transition";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";

import { RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import withDeleteSkipCondition from "./withDeleteSkipCondition";
import withDeleteSkipConditions from "./withDeleteSkipConditions";

import { Label } from "components/Forms";

export const LABEL_IF = "If";
export const LABEL_ELSE = "Else";
export const LABEL_ELSE_IF = "Else if";
export const LABEL_AND = "And";
export const LABEL_OR = "Or";
export const LABEL_GROUP_TITLE = "Logic rule builder";
export const LABEL_REMOVE_GROUP = "Remove OR";
export const LABEL_REMOVE_ALL_GROUPS = "Remove logic rule";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

const Rule = styled.div`
  &:not(:first-of-type) {
    margin-top: 2em;
  }
`;

export const Title = styled.h2`
  letter-spacing: 0.05em;
  font-size: 0.9em;
  font-weight: bold;
`;

const Header = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 0.5em 1em;
  margin-top: -1px;
  border-top: 3px solid ${colors.primary};
  display: flex;
  align-items: center;
`;

const Middle = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 0.5em 1em;
  margin-top: -1px;
  border-left: 3px solid ${colors.primary};
  display: flex;
  align-items: center;
`;

const RemoveRuleButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  margin-left: auto;
  padding: 0.2em;
`;

export class UnwrappedSkipConditionEditor extends React.Component {
  static propTypes = {
    pageId: PropTypes.string,
    expressionGroup: PropTypes.object, // eslint-disable-line
    expressionGroupIndex: PropTypes.number,
    deleteSkipCondition: PropTypes.func.isRequired,
    deleteSkipConditions: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    ifLabel: "If",
  };

  handleDeleteClick = () => {
    this.props.deleteSkipCondition(this.props.expressionGroup.id);
  };

  handleDeleteAllClick = () => {
    this.props.deleteSkipConditions(this.props.pageId);
  };

  render() {
    const { className, expressionGroupIndex, expressionGroup } = this.props;

    const existingRadioConditions = {};

    const header = (
      <Header>
        <Label inline>{LABEL_GROUP_TITLE}</Label>
        <RemoveRuleButton
          onClick={this.handleDeleteAllClick}
          data-test="btn-remove-skip-conditions"
        >
          {LABEL_REMOVE_ALL_GROUPS}
        </RemoveRuleButton>
      </Header>
    );
    const middle = (
      <Middle>
        <Label inline>{LABEL_OR}</Label>
        <RemoveRuleButton
          onClick={this.handleDeleteClick}
          data-test="btn-remove-skip-conditions"
        >
          {LABEL_REMOVE_GROUP}
        </RemoveRuleButton>
      </Middle>
    );

    return (
      <Rule data-test="skip-condition" className={className}>
        {expressionGroupIndex > 0 ? middle : header}
        <Expressions>
          <TransitionGroup>
            {expressionGroup.expressions.map((expression, index) => {
              const component = (
                <Transition key={expression.id}>
                  <BinaryExpressionEditor
                    expression={expression}
                    expressionGroupId={expressionGroup.id}
                    label={index > 0 ? LABEL_AND : LABEL_IF}
                    isOnlyExpression={expressionGroup.expressions.length === 1}
                    isLastExpression={
                      index === expressionGroup.expressions.length - 1
                    }
                    canAddCondition={
                      !existingRadioConditions[get("left.id", expression)]
                    }
                    includeSelf={false}
                  />
                </Transition>
              );
              if (get("left.type", expression) === RADIO) {
                existingRadioConditions[get("left.id", expression)] = true;
              }
              return component;
            })}
          </TransitionGroup>
        </Expressions>
      </Rule>
    );
  }
}

const withMutations = flow(withDeleteSkipCondition, withDeleteSkipConditions);

export default withMutations(UnwrappedSkipConditionEditor);
