import React from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import styled from "styled-components";

import CustomPropTypes from "custom-prop-types";

import Error from "components/Error";
import Loading from "components/Loading";
import Button from "components/buttons/Button";

import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";

import MetadataTable from "./MetadataTable";
import NoMetadata from "./NoMetadata";

import withCreateMetadata from "./withCreateMetadata";
import withDeleteMetadata from "./withDeleteMetadata";
import withUpdateMetadata from "./withUpdateMetadata";
import GetMetadataQuery from "./GetMetadataQuery";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1em auto;
  padding: 0 1em;
  width: 100%;
  max-width: 80em;
`;

export const UnwrappedMetadataPageContent = ({
  loading,
  error,
  data: { questionnaire },
  onAddMetadata,
  onDeleteMetadata,
  onUpdateMetadata,
}) => {
  if (loading) {
    return <Loading height="100%">Questionnaire metadata loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  if (!questionnaire) {
    return <Error>Oops! Questionnaire could not be found</Error>;
  }

  return (
    <Container>
      <Header title="Metadata" />
      {questionnaire.metadata.length ? (
        <>
          <Toolbar>
            <Button onClick={() => onAddMetadata(questionnaire.id)}>
              Add metadata
            </Button>
          </Toolbar>
          <StyledGrid>
            <ScrollPane permanentScrollBar data-test="metadata-modal-content">
              <StyledMainCanvas>
                <MetadataTable
                  metadata={questionnaire.metadata}
                  questionnaireId={questionnaire.id}
                  onAdd={onAddMetadata}
                  onDelete={onDeleteMetadata}
                  onUpdate={onUpdateMetadata}
                />
              </StyledMainCanvas>
            </ScrollPane>
          </StyledGrid>
        </>
      ) : (
        <NoMetadata onAddMetadata={() => onAddMetadata(questionnaire.id)} />
      )}
    </Container>
  );
};

UnwrappedMetadataPageContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
  onAddMetadata: PropTypes.func.isRequired,
  onDeleteMetadata: PropTypes.func.isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
};

const MetadataPageContent = flowRight(
  withCreateMetadata,
  withDeleteMetadata,
  withUpdateMetadata
)(UnwrappedMetadataPageContent);

const MetadataPage = ({
  match: {
    params: { questionnaireId },
  },
}) => (
  <GetMetadataQuery questionnaireId={questionnaireId}>
    {props => <MetadataPageContent {...props} />}
  </GetMetadataQuery>
);

MetadataPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default MetadataPage;
