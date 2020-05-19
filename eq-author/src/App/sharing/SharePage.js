import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 2em;
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const SharePage = ({ match }) => {
  return (
    <Container>
      <Header title="Sharing" />
      <StyledGrid>
        <ScrollPane permanentScrollBar data-test="sharing-page-content">
          <StyledMainCanvas>
            <div>HELLO WORLD AM I BETTER NOW?</div>
          </StyledMainCanvas>
        </ScrollPane>
      </StyledGrid>
    </Container>
  );
};

SharePage.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default SharePage;
