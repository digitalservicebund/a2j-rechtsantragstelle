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

  describe("render indexLabel", () => {
    const variantsWithIndexLabel = ["numbered", "stepByStep"] as const;
    variantsWithIndexLabel.forEach((variant) => {
      it(`should render indexLabel for ${variant}`, () => {
        const { getByText } = render(<ListItem index={1} variant={variant} />);
        expect(getByText("1")).toBeInTheDocument();
      });
    });
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

  it("should render an accordion", () => {
    const { getByRole } = render(
      <ListItem
        variant="numbered"
        accordion={{
          items: [{ title: "title", description: "content" }],
        }}
      />,
    );
    const accordionGroup = getByRole("group");
    expect(accordionGroup).toBeInTheDocument();
    expect(accordionGroup).toHaveTextContent("title");
    expect(accordionGroup).toHaveTextContent("content");
  });

  it("should render vertical line in stepByStep", () => {
    const { container } = render(<ListItem variant="stepByStep" />);
    expect(container.getElementsByClassName("w-2 h-full")).toHaveLength(1);
  });

  describe("ImageMarker", () => {
    it("should hide the image marker from screen readers", () => {
      const { container } = render(
        <ListItem
          variant="unordered"
          image={{
            url: "/test.png",
            alternativeText: "",
          }}
        />,
      );
      const wrapperDiv = container.querySelector("[aria-hidden='true']");
      expect(wrapperDiv).toBeInTheDocument();
    });

    it("should render a custom image marker when image props are provided", () => {
      const { container } = render(
        <ListItem
          variant="unordered"
          image={{
            url: "/test.png",
            alternativeText: "",
            className: "custom-marker",
          }}
        />,
      );
      expect(container.querySelector(".custom-marker")).toBeInTheDocument();
    });

    it("should not render the styled marker when image is provided", () => {
      const { container } = render(
        <ListItem
          variant="numbered"
          index={1}
          image={{
            url: "/test.png",
            alternativeText: "",
          }}
        />,
      );
      expect(
        container.querySelector(".border-gray-400"),
      ).not.toBeInTheDocument();
    });
  });

  describe("variant styles", () => {
    it("should apply correct classes for unordered variant", () => {
      const { container } = render(<ListItem variant="unordered" />);
      expect(container.querySelector(".border-black")).toBeInTheDocument();
    });

    it("should apply correct classes for numbered variant", () => {
      const { container } = render(<ListItem variant="numbered" />);
      expect(container.querySelector(".border-gray-400")).toBeInTheDocument();
    });

    it("should apply correct classes for stepByStep variant", () => {
      const { container } = render(<ListItem variant="stepByStep" />);
      expect(container.querySelector(".bg-blue-800")).toBeInTheDocument();
    });
  });
});
