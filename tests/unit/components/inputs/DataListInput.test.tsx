import { render } from "@testing-library/react";
import DataListInput from "~/components/inputs/DataListInput";

const TEST_INPUT_NAME_PROPS = "anyInputName";

describe("DataListInput", () => {
  it("should return null when the dataList props is undefined", () => {
    const { container } = render(
      <DataListInput inputName={TEST_INPUT_NAME_PROPS} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the component with datalist and option html tags when pass all the correct props", () => {
    const { container } = render(
      <DataListInput inputName={TEST_INPUT_NAME_PROPS} dataList="airports" />,
    );

    expect(container.querySelector("datalist")).toBeInTheDocument();
    expect(
      container.querySelector(`#data-list-${TEST_INPUT_NAME_PROPS}`),
    ).toBeInTheDocument();

    expect(
      container.querySelectorAll("datalist > option").length,
    ).toBeGreaterThan(0);
  });
});
