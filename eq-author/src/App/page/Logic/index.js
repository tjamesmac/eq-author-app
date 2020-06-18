import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Redirect, Link, Switch, Route } from "react-router-dom";
import { buildPagePath } from "utils/UrlUtils";
import Loading from "components/Loading";
import Error from "components/Error";
import { get } from "lodash";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";
import { Grid, Column } from "components/Grid";

import EditorLayout from "components/EditorLayout";
import QuestionPageEditor from "App/page/Design/QuestionPageEditor";
import Routing from "./Routing";

const ROUTING_PAGE_TYPES = ["QuestionPage"];
const activeClassName = "active";

const LogicMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

// const TabsContainer = styled.div`
//   border-right
// `;

// const StyledLi = styled.li`
// `;

const LogicContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const StyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const LogicLink = styled(Link)`
  --color-text: ${colors.black};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: 4px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:focus {
    outline: 3px solid ${colors.orange};
    outline-offset: -3px;
  }

  &:active {
    outline: none;
  }

  &.${activeClassName} {
    --color-text: ${colors.white};

    background: ${colors.blue};
    pointer-events: none;
  }
`;

export class UnwrappedQuestionRoutingRoute extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // eslint-disable-line
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  renderContent() {
    const { data, loading, error, match } = this.props;
    console.log("\n\ndata", data);
    if (loading) {
      return <Loading height="20em">Loading routing</Loading>;
    }

    const page = get(data, "page");

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    if (!ROUTING_PAGE_TYPES.includes(page.pageType)) {
      return (
        <Redirect
          to={buildPagePath({
            questionnaireId: match.params.questionnaireId,
            pageId: page.id,
          })}
        />
      );
    }

    const routes = [
      {
        path: `${match.path}`,
        exact: true,
        main: Routing,
      },
      {
        path: `${match.path}/routing`,
        exact: true,
        main: Routing,
      },
      {
        path: `${match.path}/Skip`,
        exact: true,
        main: () => <h2>Skip logic is not yet defined</h2>,
      },
    ];

    return (
      <LogicMainCanvas>
        <Grid>
          <Column gutters={false} cols={2.5}>
            <StyledUl>
              <li>
                <LogicLink>Select your logic</LogicLink>
              </li>
              <li>
                <LogicLink
                  exact
                  to={`${match.url}/routing`}
                  activeClassName="active"
                  onlyActiveOnIndex
                >
                  Routing Logic
                </LogicLink>
              </li>
              <li>
                <LogicLink
                  exact
                  to={`${match.url}/skip`}
                  activeClassName="active"
                  onlyActiveOnIndex
                >
                  Skip Logic
                </LogicLink>
              </li>
            </StyledUl>
          </Column>

          <Column gutters={false} cols={9.5}>
            <LogicContainer>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact}
                  component={route.main}
                />
              ))}
            </LogicContainer>
          </Column>
        </Grid>
      </LogicMainCanvas>
      //  {/* <div style={{ flex: 1, padding: "10px" }}>
      //           <Switch>
      //             <Route
      //               key="page-routing"
      //               path={`${match.path}`}
      //               // path="/q/:questionnaireId/page/:pageId/logic/routing"
      //               component={Routing}
      //               // page={page}
      //             />
      //           </Switch>
      //         </div> */}

      // <div>
      //   <StyledUl>
      //     <li>
      //       <Link to={`${match.url}/routing`}>Routing Logic</Link>
      //     </li>
      //     <li>
      //       <Link to="/dashboard">Skip Logic</Link>
      //     </li>
      //   </StyledUl>

      //   <hr />

      //   <Switch>
      //     <Route
      //       key="page-routing"
      //       path={`${match.path}`}
      //       // path="/q/:questionnaireId/page/:pageId/logic/routing"
      //       component={Routing}
      //       // page={page}
      //     />
      //     ,
      //   </Switch>
      // </div>
    );
  }

  render() {
    const displayName = get(this.props.data, "page.displayName", "");
    return (
      <EditorLayout design preview logic title={displayName}>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
      ...QuestionPage
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
`;

const QueryingRoute = props => (
  <Query
    query={PAGE_QUERY}
    variables={{
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => <UnwrappedQuestionRoutingRoute {...innerProps} {...props} />}
  </Query>
);
QueryingRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QueryingRoute;
