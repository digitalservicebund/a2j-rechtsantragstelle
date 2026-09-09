import { render } from "@testing-library/react";
import { Badge } from "../Badge";
import { type IconName } from "~/components/common/utils";

describe("Badge", () => {
  it("should not render when children are not provided", () => {
    // oxlint-disable-next-line react/no-children-prop
    const { container } = render(<Badge children={undefined}></Badge>);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render when children has empty string", () => {
    // oxlint-disable-next-line react/no-children-prop
    const { container } = render(<Badge children={""}></Badge>);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render when children are provided", () => {
    const { container, getByText } = render(<Badge>Test Badge</Badge>);
    expect(container).not.toBeEmptyDOMElement();
    expect(getByText("Test Badge")).toBeInTheDocument();
  });

  it("should render with an icon when the icon prop is provided", () => {
    const { getByTestId } = render(<Badge icon="group">Test Badge</Badge>);
    expect(getByTestId("icon-group")).toBeInTheDocument();
  });

  it("should render correct variant class when the variant prop is info", () => {
    const { container, getByTestId } = render(
      <Badge variant="info" icon="info">
        Test Badge
      </Badge>,
    );
    expect(container.firstChild).toHaveClass("kern-badge--info");
    expect(getByTestId("icon-info")).toHaveClass("fill-kern-feedback-info");
    expect(getByTestId("icon-info")).toHaveClass("kern-icon--info");
  });

  it("should render correct variant class when the variant prop is success", () => {
    const iconSuccess = "success" as IconName;

    const { container, getByTestId } = render(
      <Badge variant="success" icon={iconSuccess}>
        Test Badge
      </Badge>,
    );
    expect(container.firstChild).toHaveClass("kern-badge--success");
    expect(getByTestId("icon-success")).toHaveClass(
      "fill-kern-feedback-success",
    );
    expect(getByTestId("icon-success")).toHaveClass("kern-icon--success");
  });

  it("should render correct variant class when the variant prop is warning", () => {
    const { container, getByTestId } = render(
      <Badge variant="warning" icon="warning">
        Test Badge
      </Badge>,
    );
    expect(container.firstChild).toHaveClass("kern-badge--warning");
    expect(getByTestId("icon-warning")).toHaveClass(
      "fill-kern-feedback-warning",
    );
    expect(getByTestId("icon-warning")).toHaveClass("kern-icon--warning");
  });

  it("should render correct variant class when the variant prop is danger", () => {
    const iconDanger = "danger" as IconName;

    const { container, getByTestId } = render(
      <Badge variant="danger" icon={iconDanger}>
        Test Badge
      </Badge>,
    );
    expect(container.firstChild).toHaveClass("kern-badge--danger");
    expect(getByTestId("icon-danger")).toHaveClass("fill-kern-feedback-danger");
    expect(getByTestId("icon-danger")).toHaveClass("kern-icon--danger");
  });
});
