import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight, get } from "lodash";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";

import CustomPropTypes from "custom-prop-types";

import { withQuestionnaire } from "components/QuestionnaireContext";

import { colors } from "constants/theme";
import PageTitle from "./PageTitle";
import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";
import SavingIndicator from "./SavingIndicator";

const StyledHeader = styled.header`
  color: ${colors.white};
  background: ${colors.primary};
  font-weight: 400;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 1em 1.5em;
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
  margin-right: -1.5em;
`;

const SavingContainer = styled.div`
  position: absolute;
  right: 2em;
  bottom: 0.5em;
`;

export const UnconnectedHeader = props => {
  const { questionnaire, title, children, match } = props;
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(
    match.params.modifier === "settings"
  );

  useSubscription(publishStatusSubscription, {
    variables: { id: match.params.questionnaireId },
  });

  const permission = get(questionnaire, "permission");

  return (
    <>
      <StyledHeader>
        <Flex>
          <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle>
        </Flex>
        <PageTitle>{title}</PageTitle>
        {children}
        <SavingContainer>
          <SavingIndicator isUnauthorized={permission !== "Write"} />
        </SavingContainer>
      </StyledHeader>
      {questionnaire && (
        <>
          <UpdateQuestionnaireSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setSettingsModalOpen(false)}
            questionnaire={questionnaire}
          />
        </>
      )}
    </>
  );
};

export const publishStatusSubscription = gql`
  subscription PublishStatus($id: ID!) {
    publishStatusUpdated(id: $id) {
      id
      publishStatus
    }
  }
`;

UnconnectedHeader.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  title: PropTypes.string,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  children: PropTypes.node,
  match: PropTypes.shape({
    params: PropTypes.shape({
      modifier: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default flowRight(withQuestionnaire, withRouter)(UnconnectedHeader);
