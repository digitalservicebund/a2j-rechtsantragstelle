import { render, screen } from "@testing-library/react";
import List, { listItemNotEmpty } from "../List";
import type { ListItemProps } from "../types";

describe("List", () => {
  it("should render subheading when it is given", () => {
    const mockSubheadingText = "subheadingText";
    render(
      <List items={[]} variant="unordered" subheading={mockSubheadingText} />,
    );
    expect(screen.getByText(mockSubheadingText)).toBeInTheDocument();
  });

  it("should not render subheading when it is not given", () => {
    const mockSubheadingText = "subheadingText";
    render(<List items={[]} variant="unordered" />);
    expect(screen.queryByText(mockSubheadingText)).not.toBeInTheDocument();
  });

  describe("renders correct list tag", () => {
    it("renders <ul> if variant is 'unordered' and no images", () => {
      render(<List items={[]} variant="unordered" />);
      expect(screen.getByRole("list").tagName).toBe("UL");
    });

    it("renders <ul> if any item has an image", () => {
      const items: ListItemProps[] = [
        {
          headline: { text: "One" },
          image: { url: "/img.png", alternativeText: "" },
        },
        { headline: { text: "Two" } },
      ];
      render(<List items={items} variant="numbered" />);
      expect(screen.getByRole("list").tagName).toBe("UL");
    });

    it("renders <ol> if variant is 'numbered' and no images", () => {
      const items: ListItemProps[] = [
        { headline: { text: "One" } },
        { headline: { text: "Two" } },
      ];
      render(<List items={items} variant="numbered" />);
      expect(screen.getByRole("list").tagName).toBe("OL");
    });
  });
});

describe("listItemNotEmpty", () => {
  it("should return true if a ListItem has a headline but no content", () => {
    const listItem: ListItemProps = { headline: { text: "headline" } };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(listItemNotEmpty({ ...listItem, content: "<p></p>\n" })).toBe(true);
  });

  it("should return true if a ListItem has content but no headline", () => {
    const listItem: ListItemProps = { content: "some content" };
    expect(listItemNotEmpty(listItem)).toBe(true);
    expect(
      listItemNotEmpty({ ...listItem, headline: { text: "\n<h1></h1>" } }),
    ).toBe(true);
  });

  it("should return true when a ListItem has both headline and content", () => {
    const listItem: ListItemProps = {
      headline: { text: "headline" },
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
