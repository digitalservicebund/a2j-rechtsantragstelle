import { render } from "@testing-library/react";
import List, { listItemNotEmpty } from "../List";
import type { ListItemProps } from "../types";

describe("List", () => {
  it("should render subheading when it is given", () => {
    const mockSubheadingText = "subheadingText";
    const { getByText } = render(
      <List items={[]} variant="unordered" subheading={mockSubheadingText} />,
    );
    expect(getByText(mockSubheadingText)).toBeInTheDocument();
  });

  it("should not render subheading when it is not given", () => {
    const mockSubheadingText = "subheadingText";
    const { queryByText } = render(<List items={[]} variant="unordered" />);
    expect(queryByText(mockSubheadingText)).not.toBeInTheDocument();
  });

  describe("renders correct list tag", () => {
    it("renders <ul> if variant is 'unordered' and no images", () => {
      const { container } = render(<List items={[]} variant="unordered" />);
      expect(container.querySelector("ul")).toBeInTheDocument();
    });

    it("renders <ul> if any item has an image", () => {
      const items: ListItemProps[] = [
        {
          id: 10,
          headline: { text: "One" },
          image: { url: "/img.png", alternativeText: "" },
        },
        { id: 11, headline: { text: "Two" } },
      ];
      const { container } = render(<List items={items} variant="numbered" />);
      expect(container.querySelector("ul")).toBeInTheDocument();
    });

    it("renders <ol> if variant is 'numbered' and no images", () => {
      const items: ListItemProps[] = [
        { id: 10, headline: { text: "One" } },
        { id: 11, headline: { text: "Two" } },
      ];
      const { container } = render(<List items={items} variant="numbered" />);
      expect(container.querySelector("ol")).toBeInTheDocument();
    });
  });
});

describe("listItemNotEmpty", () => {
  it("should return true if a ListItem has a headline but no content", () => {
    const listItem: ListItemProps = { id: 10, headline: { text: "headline" } };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(listItemNotEmpty({ ...listItem, content: "<p></p>\n" })).toBe(true);
  });

  it("should return true if a ListItem has content but no headline", () => {
    const listItem: ListItemProps = { id: 10, content: "some content" };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(
      listItemNotEmpty({ ...listItem, headline: { text: "\n<h1></h1>" } }),
    ).toBe(true);
  });

  it("should return true when a ListItem has both headline and content", () => {
    const listItem: ListItemProps = {
      id: 10,
      headline: { text: "headline" },
      content: "<p>some content</p>",
    };
    expect(listItemNotEmpty(listItem)).toBe(true);
  });

  it("should return false if a ListItem doesn't have headline or content", () => {
    const listItem: ListItemProps = { id: 10 };
    expect(listItemNotEmpty(listItem)).toBe(false);
    expect(
      listItemNotEmpty({
        id: 11,
        headline: { text: "" },
        content: "<h3></h3>\n",
      }),
    ).toBe(false);
  });
});
