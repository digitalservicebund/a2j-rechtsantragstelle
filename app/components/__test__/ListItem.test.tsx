import { render } from "@testing-library/react";
import ListItem from "../ListItem";

describe("ListItem", () => {
  it("headline and content  should be rendered", () => {
    const { getByText } = render(
      <ListItem
        content="content"
        headline={{ text: "headlineText" }}
        variant="unordered"
      />,
    );
    expect(getByText("content")).toBeInTheDocument();
    expect(getByText("headlineText")).toBeInTheDocument();
  });

  it("render indexLabel", () => {
    const { getByText } = render(<ListItem index={1} variant="numbered" />);
    expect(getByText("1")).toBeInTheDocument();
  });

  it("renders no indexLabel for unordered", () => {
    const { queryByText } = render(<ListItem index={1} variant="unordered" />);
    expect(queryByText("1")).not.toBeInTheDocument();
  });

  it("should render buttons with labels", () => {
    const { getByText, getByRole } = render(
      <ListItem buttons={[{ text: "label" }]} variant="numbered" />,
    );
    expect(getByText("label")).toBeInTheDocument();
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("should render no buttons for empty array", () => {
    const { queryByRole } = render(
      <ListItem buttons={[]} variant="numbered" />,
    );
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
