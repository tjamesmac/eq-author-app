import React from "react";
import { shallow } from "enzyme";

import NoRouting from "./NoRouting";
import { render, fireEvent, screen } from "tests/utils/rtl";

describe("components/NoRouting", () => {
  const disabledTitle = "Routing is not available for this quesiton";
  const disabledParagraph =
    "You can't route on the last question in a questionnaire.";
  const enabledTitle = "No routing rules exist for this question";
  const enabledParagraph =
    "Users completing this question will be taken to the next page.";

  it("should render with button enabled", () => {
    const { queryByText } = render(
      <NoRouting onAddRouting={jest.fn()} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );

    expect(queryByText(enabledTitle)).toBeTruthy();
    expect(queryByText(enabledParagraph)).toBeTruthy();
    expect(queryByText(disabledTitle)).toBeFalsy();
    expect(queryByText(disabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-routing")).not.toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should render with button disabled", () => {
    const { queryByText } = render(
      <NoRouting onAddRouting={jest.fn()} title="Test" isLastPage>
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );

    expect(queryByText(disabledTitle)).toBeTruthy();
    expect(queryByText(disabledParagraph)).toBeTruthy();
    expect(queryByText(enabledTitle)).toBeFalsy();
    expect(queryByText(enabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-routing")).toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should call onAddRouting when button clicked", () => {
    const onAddRouting = jest.fn();
    const { getByTestId } = render(
      <NoRouting onAddRouting={onAddRouting} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );
    const button = getByTestId("btn-add-routing");
    fireEvent.click(button);
    expect(onAddRouting).toHaveBeenCalledTimes(1);
  });
});
