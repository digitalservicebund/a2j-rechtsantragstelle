import { render } from "@testing-library/react";
import ListItem from "../ListItem";

describe("ListItem", () => {
  it("headline and content  should be rendered", () => {
    const { getByText } = render(
      <ListItem content="content" headline={{ text: "headlineText" }} />,
    );
    expect(getByText("content")).toBeInTheDocument();
    expect(getByText("headlineText")).toBeInTheDocument();
  });

  it("render indexLabel", () => {
    const { getByText } = render(<ListItem index={1} />);
    expect(getByText("1")).toBeInTheDocument();
  });

  it("should render buttons with labels", () => {
    const { getByText, getByRole } = render(
      <ListItem buttons={[{ text: "label" }]} />,
    );
    expect(getByText("label")).toBeInTheDocument();
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("should render no buttons for empty array", () => {
    const { queryByRole } = render(<ListItem buttons={[]} />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
