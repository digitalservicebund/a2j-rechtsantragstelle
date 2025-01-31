import { render } from "@testing-library/react";
import { ListItemProps } from "~/components/ListItem";
import List, { listItemNotEmpty } from "../List";

describe("List", () => {
  it("should render subheading when it is given", () => {
    const mockSubheadinText = "subheadingText";

    const { getByText } = render(
      <List items={[]} subheading={mockSubheadinText} />,
    );

    expect(getByText(mockSubheadinText)).toBeInTheDocument();
  });

  it("should not render subheading when it is not given", () => {
    const mockSubheadinText = "subheadingText";
    const { queryByText } = render(<List items={[]} />);

    expect(queryByText(mockSubheadinText)).not.toBeInTheDocument();
  });
});

describe("listItemNotEmpty", () => {
  it("should return true if a ListItem has a headline but no content", () => {
    const listItem: ListItemProps = {
      headline: {
        text: "headline",
      },
    };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(listItemNotEmpty({ ...listItem, content: "<p></p>\n" })).toBe(true);
  });

  it("should return true if a ListItem has content but no headline", () => {
    const listItem: ListItemProps = {
      content: "some content",
    };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(
      listItemNotEmpty({ ...listItem, headline: { text: "\n<h1></h1>" } }),
    ).toBe(true);
  });

  it("should return true when a ListItem has both headline and content", () => {
    const listItem: ListItemProps = {
      headline: {
        text: "headline",
      },
      content: "<p>some content</p>",
    };
    expect(listItemNotEmpty(listItem)).toBe(true);
  });

  it("should return false if a ListItem doesn't have headline or content", () => {
    const listItem: ListItemProps = {};
    expect(listItemNotEmpty(listItem)).toBe(false);
    expect(
      listItemNotEmpty({ headline: { text: "" }, content: "<h3></h3>\n" }),
    ).toBe(false);
  });
});
