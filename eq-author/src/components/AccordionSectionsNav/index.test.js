import React from "react";
import { render, fireEvent, act } from "tests/utils/rtl";
import SectionAccordion from "./";

describe("Section Accordion", () => {
  it("should render accordion expanded", () => {
    const { getByTestId } = render(
      <SectionAccordion title="test" titleName="section1">
        section accordion panel
      </SectionAccordion>
    );
    expect(getByTestId("accordion-section1-body")).toBeVisible();
    expect(getByTestId("accordion-section1-button")).toBeVisible();
  });

  it("should open and close section accordion", async () => {
    const { getByTestId } = render(
      <SectionAccordion title="test" titleName="section1">
        section accordion panel
      </SectionAccordion>
    );

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-section1-button"));
    });
    expect(getByTestId("accordion-section1-body")).not.toBeVisible();

    await act(async () => {
      await fireEvent.click(getByTestId("accordion-section1-button"));
    });
    expect(getByTestId("accordion-section1-body")).toBeVisible();
  });
});
