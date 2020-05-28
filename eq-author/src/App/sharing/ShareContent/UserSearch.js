import React, { useState } from "react";
import reactStringReplace from "react-string-replace";
import PropTypes from "prop-types";
import Downshift from "downshift";

import Button from "components/buttons/Button";

import {
  SearchContainer,
  SearchInput,
  SearchResults,
  SearchResult,
  SearchResultName,
  SearchResultEmail,
  SearchField,
  Highlight,
  SpacedFlexContainer,
} from "../styles/UserSearch";

const propTypes = {
  UserSearch: {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        email: PropTypes.string.isRequired,
      })
    ).isRequired,
    onUserSelect: PropTypes.func.isRequired,
  },
};

const highlighSearchTerm = (...args) =>
  reactStringReplace(...args, (match, i) => (
    <Highlight key={i}>{match}</Highlight>
  ));

const UserSearch = ({ users, onUserSelect }) => {
  const [user, setUser] = useState(null);

  const addUser = target => {
    setUser(target);
  };

  return (
    <>
      <Downshift
        initialIsOpen={false}
        onSelect={addUser}
        itemToString={user => (user ? user.name : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <SearchContainer>
              <SearchField>
                <SpacedFlexContainer>
                  <SearchInput
                    {...getInputProps()}
                    placeholder="search people by name or email address"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    data-test="editor-add-button"
                    onClick={() => onUserSelect(user)}
                  >
                    Add
                  </Button>
                </SpacedFlexContainer>
                <SearchResults {...getMenuProps()}>
                  {isOpen &&
                    users
                      .filter(user => {
                        if (!inputValue) {
                          return false;
                        }
                        const value = inputValue.toLowerCase();
                        return (
                          (user.name || "").toLowerCase().includes(value) ||
                          user.email.toLowerCase().includes(value)
                        );
                      })
                      .map((user, index) => (
                        <SearchResult
                          key={user.id}
                          {...getItemProps({
                            index,
                            item: user,
                            selected: highlightedIndex === index,
                          })}
                        >
                          <SearchResultName>
                            {highlighSearchTerm(user.name, inputValue)}
                          </SearchResultName>
                          <SearchResultEmail>
                            {"<"}
                            {highlighSearchTerm(user.email, inputValue)}
                            {">"}
                          </SearchResultEmail>
                        </SearchResult>
                      ))}
                </SearchResults>
              </SearchField>
            </SearchContainer>
          </div>
        )}
      </Downshift>
    </>
  );
};

UserSearch.propTypes = propTypes.UserSearch;

export default UserSearch;
