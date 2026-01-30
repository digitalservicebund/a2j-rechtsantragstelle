import { render } from "@testing-library/react";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import ArraySummaryItemButton from "../ArraySummaryItemButton";

const defaultProps = {
  itemIndex: 0,
  category: "unterhaltszahlungen",
  editUrl:
    "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/0/daten",
  csrf: "test-csrf-token",
  items: {
    unterhaltszahlungen: [
      {
        firstName: "Another",
        surname: "test",
        familyRelationship: "mother",
      },
    ],
  },
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useFetcher: () => ({
      Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    }),
    useLocation: () => ({ pathname: "/test-path" }),
  };
});

describe("ArraySummaryItemButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render edit and delete buttons", () => {
    const { getByText } = render(<ArraySummaryItemButton {...defaultProps} />);

    expect(getByText("Bearbeiten")).toBeInTheDocument();
    expect(getByText("Löschen")).toBeInTheDocument();
  });

  it("should render edit button with correct href", () => {
    const { container } = render(<ArraySummaryItemButton {...defaultProps} />);

    const editButton = container.querySelector(
      `a[href="${defaultProps.editUrl}"]`,
    );
    expect(editButton).toBeInTheDocument();
  });

  it("should render delete form with correct action and hidden inputs", () => {
    const { container } = render(<ArraySummaryItemButton {...defaultProps} />);

    const form = container.querySelector(
      'form[action="/action/delete-array-item"]',
    );
    expect(form).toBeInTheDocument();

    const csrfInput = form?.querySelector(`input[name="${CSRFKey}"]`);
    expect(csrfInput).toHaveValue("test-csrf-token");

    const pathnameInput = form?.querySelector(
      'input[name="pathnameArrayItem"]',
    );
    expect(pathnameInput).toHaveValue("/test-path");

    const jsEnabledInput = form?.querySelector('input[name="_jsEnabled"]');
    expect(jsEnabledInput).toHaveValue("true");
  });

  it("should render delete button with correct name and value", () => {
    const { container } = render(<ArraySummaryItemButton {...defaultProps} />);

    const deleteButton = container.querySelector(
      'button[name="unterhaltszahlungen"][value="0"][type="submit"]',
    );
    expect(deleteButton).toBeInTheDocument();
  });

  it("should render screen reader text when heading is provided", () => {
    const { container } = render(
      <ArraySummaryItemButton
        {...defaultProps}
        heading={{
          text: "Person 1",
          tagName: "h3",
        }}
      />,
    );

    const srOnlyElements = container.querySelectorAll(".sr-only");
    expect(srOnlyElements).toHaveLength(2);
    expect(srOnlyElements[0]).toHaveTextContent("Person 1"); // edit button
    expect(srOnlyElements[1]).toHaveTextContent("Person 1"); // delete button
  });

  it("should not render screen reader text when heading is not provided", () => {
    const { container } = render(<ArraySummaryItemButton {...defaultProps} />);

    const srOnlyElements = container.querySelectorAll(".sr-only");
    expect(srOnlyElements).toHaveLength(0);
  });
});
