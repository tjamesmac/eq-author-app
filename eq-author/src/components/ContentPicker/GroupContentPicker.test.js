import React from "react";
import { shallow } from "enzyme";
import ContentPickerButton from "components/ContentPicker/ContentPickerButton";
import GroupContentPicker from "components/ContentPicker/GroupContentPicker";
import { byTestAttr } from "tests/utils/selectors";

const QUESTIONPAGE_PICKER = byTestAttr("QuestionPage-picker");
const SECTION_PICKER = byTestAttr("Section-picker");
const END_OF_Q_PICKER = byTestAttr("endOfQuestionnaire-picker");

const data = {
  logicalDestinations: [
    {
      id: "NextPage",
      logicalDestination: "NextPage",
    },
    {
      id: "EndOfQuestionnaire",
      logicalDestination: "EndOfQuestionnaire",
    },
  ],
  questionPages: [
    {
      id: "1",
      displayName: "Page 1",
    },
    {
      id: "2",
      displayName: "Page 2",
    },
    {
      id: "3",
      displayName: "Page 3",
    },
  ],
  sections: [
    {
      id: "1",
      displayName: "Section 1",
    },
    {
      id: "2",
      displayName: "Section 2",
    },
    {
      id: "3",
      displayName: "Section 3",
    },
  ],
};

const config = [
  {
    id: "QuestionPage",
    title: "Other pages in this section",
    groupKey: "questionPages",
    expandable: true,
  },
  {
    id: "Section",
    title: "Other sections",
    groupKey: "sections",
    expandable: true,
  },
  {
    id: "endOfQuestionnaire",
    title: "End of questionnaire",
    groupKey: "logicalDestinations",
    expandable: false,
    type: "RoutingLogicalDestination",
  },
];

describe("GroupContentPicker", () => {
  let onSubmit, onClose;

  const createWrapper = (props, render = shallow) =>
    render(
      <GroupContentPicker
        onSubmit={onSubmit}
        onClose={onClose}
        config={config}
        data={data}
        {...props}
      />
    );

  beforeEach(() => {
    onSubmit = jest.fn();
    onClose = jest.fn();
  });

  it("should render full content picker", () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it("should disable picker if no options available", () => {
    const wrapper = createWrapper({
      data: {
        ...data,
        questionPages: [],
        logicalDestinations: [],
      },
    });

    expect(wrapper.find(QUESTIONPAGE_PICKER).prop("disabled")).toBe(true);
    expect(wrapper.find(END_OF_Q_PICKER).prop("disabled")).toBe(true);
  });

  it("should hide pickers below open picker", () => {
    const wrapper = createWrapper();

    wrapper.find(QUESTIONPAGE_PICKER).simulate("titleClick");
    expect(wrapper.find(QUESTIONPAGE_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(SECTION_PICKER).prop("hidden")).toBe(true);
    expect(wrapper.find(END_OF_Q_PICKER).prop("hidden")).toBe(true);

    wrapper.find(SECTION_PICKER).simulate("titleClick");
    expect(wrapper.find(QUESTIONPAGE_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(SECTION_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(END_OF_Q_PICKER).prop("hidden")).toBe(true);
  });

  it("should start open if section preselected", () => {
    const wrapper = createWrapper({
      selectedObj: {
        page: null,
        section: {
          id: "1",
          displayName: "Section 1",
          __typename: "Section",
        },
        logical: null,
      },
    });

    expect(wrapper.find(QUESTIONPAGE_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(SECTION_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(END_OF_Q_PICKER).prop("hidden")).toBe(true);

    expect(wrapper.state("selectedItem")).toMatchObject({
      displayName: "Section 1",
      id: "1",
    });
  });

  it("should start open if page preselected", () => {
    const wrapper = createWrapper({
      selectedObj: {
        page: {
          id: "1",
          displayName: "Page 1",
          __typename: "QuestionPage",
        },
        section: null,
        logical: null,
      },
    });

    expect(wrapper.find(QUESTIONPAGE_PICKER).prop("hidden")).toBe(false);
    expect(wrapper.find(SECTION_PICKER).prop("hidden")).toBe(true);
    expect(wrapper.find(END_OF_Q_PICKER).prop("hidden")).toBe(true);

    expect(wrapper.state("selectedItem")).toMatchObject({
      displayName: "Page 1",
      id: "1",
    });
  });

  describe("Buttons", () => {
    it("should call onClose when cancel is clicked", () => {
      const wrapper = createWrapper();

      wrapper.find(byTestAttr("cancel-button")).simulate("click");
      expect(onClose).toHaveBeenCalled();
    });

    it("submit button should start disabled", () => {
      const wrapper = createWrapper();
      expect(wrapper.find(byTestAttr("submit-button")).prop("disabled")).toBe(
        true
      );
    });

    it("submit button should become enabled when an answer has been chosen", () => {
      const wrapper = createWrapper();
      wrapper.find(ContentPickerButton).simulate("click");
      expect(wrapper.find(byTestAttr("submit-button")).prop("disabled")).toBe(
        false
      );
    });

    it("submit button should call onSubmit from ContentPickerSingle", () => {
      const wrapper = createWrapper();
      wrapper.find(QUESTIONPAGE_PICKER).simulate("titleClick");
      wrapper
        .find(QUESTIONPAGE_PICKER)
        .simulate("optionClick", data.questionPages[0]);
      wrapper.find(byTestAttr("submit-button")).simulate("click");
      expect(onSubmit).toHaveBeenCalledWith({
        id: "1",
        displayName: "Page 1",
        config: {
          id: "QuestionPage",
          title: "Other pages in this section",
          groupKey: "questionPages",
          expandable: true,
        },
      });
    });

    it("submit button should call onSubmit from ContentPickerButton", () => {
      const wrapper = createWrapper();
      wrapper.find(END_OF_Q_PICKER).simulate("click");
      wrapper.find(byTestAttr("submit-button")).simulate("click");
      expect(onSubmit).toHaveBeenCalledWith({
        id: "endOfQuestionnaire",
        title: "End of questionnaire",
        config: {
          id: "endOfQuestionnaire",
          title: "End of questionnaire",
          groupKey: "logicalDestinations",
          expandable: false,
          type: "RoutingLogicalDestination",
        },
      });
    });
  });
});
