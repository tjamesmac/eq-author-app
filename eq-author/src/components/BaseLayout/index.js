import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";

import OfflineBanner from "components/OfflineBanner";

import PermissionsBanner from "./PermissionsBanner";
import App from "./App";

const Wrapper = styled.div`
  background-color: #fafbfc;
  height: 100vh;
  min-width: 75em;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BaseLayout = ({ children, questionnaire }) => (
  <App>
    <Wrapper>
      <OfflineBanner />
      <PermissionsBanner questionnaire={questionnaire} />
      <Main>{children}</Main>
    </Wrapper>
  </App>
);

BaseLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  questionnaire: CustomPropTypes.questionnaire,
};

export default BaseLayout;
