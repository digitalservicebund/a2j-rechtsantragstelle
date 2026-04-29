import { render } from "@testing-library/react";
import KernArraySummaryItemActions from "~/components/content/arraySummary/KernArraySummaryItemActions";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

const defaultProps = {
  itemIndex: 0,
  category: "unterhaltszahlungen",
  editUrl:
    "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/0/daten",
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useFetcher: () => ({
      Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    }),
    useRouteLoaderData: () => ({ csrf: "test-csrf-token" }),
    useLocation: () => ({ pathname: "/test-path" }),
  };
});

describe("ArraySummaryItemActions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render edit and delete buttons", () => {
    const { getByText } = render(
      <KernArraySummaryItemActions {...defaultProps} />,
    );

    expect(getByText("Bearbeiten")).toBeInTheDocument();
    expect(getByText("Löschen")).toBeInTheDocument();
  });

  it("should render edit button with correct href", () => {
    const { container } = render(
      <KernArraySummaryItemActions {...defaultProps} />,
    );

    const editButton = container.querySelector(
      `a[href="${defaultProps.editUrl}"]`,
    );
    expect(editButton).toBeInTheDocument();
  });

  it("should render delete form with correct action and hidden inputs", () => {
    const { container } = render(
      <KernArraySummaryItemActions {...defaultProps} />,
    );

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
    const { container } = render(
      <KernArraySummaryItemActions {...defaultProps} />,
    );

    const deleteButton = container.querySelector(
      'button[name="unterhaltszahlungen"][value="0"][type="submit"]',
    );
    expect(deleteButton).toBeInTheDocument();
  });

  it("should set aria-labels with heading text", () => {
    const { container } = render(
      <KernArraySummaryItemActions
        {...defaultProps}
        heading={{ text: "Person 1", tagName: "h3" }}
      />,
    );

    const elements = container.querySelectorAll("[aria-label]");

    expect(elements).toHaveLength(2);
    expect(elements[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Person 1"),
    );
    expect(elements[1]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Person 1"),
    );
  });

  it("should not render screen reader text when heading is not provided", () => {
    const { container } = render(
      <KernArraySummaryItemActions {...defaultProps} />,
    );

    const srOnlyElements = container.querySelectorAll(".sr-only");
    expect(srOnlyElements).toHaveLength(0);
  });
});
