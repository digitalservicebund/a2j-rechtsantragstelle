import { render } from "@testing-library/react";
import { useLocation, useLoaderData } from "react-router";
import {
  EmailCapture,
  type EmailCaptureProps,
} from "~/components/emailCapture/EmailCapture";
import { invalidEmailError } from "~/components/emailCapture/emailCaptureHelpers";
import { type InlineNoticeProps } from "~/components/InlineNotice";

vi.mock("react-router", () => ({
  useLoaderData: vi.fn(() => ({ csrf: "csrf" })),
  useActionData: vi.fn(),
  useLocation: vi.fn(() => ({ search: "", pathname: "" })),
}));

const mockedFieldError = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useForm: vi.fn(() => ({
    getFormProps: vi.fn(() => ({})),
    field: vi.fn(() => ({
      getInputProps: vi.fn(() => ({
        name: "email",
        id: "email",
      })),
      error: mockedFieldError,
    })),
  })),
}));

const successBanner: InlineNoticeProps = {
  title: "Success Title",
  tagName: "h1",
  look: "success",
  content: "Success message",
};
const errorBanner: InlineNoticeProps = {
  title: "Error Title",
  tagName: "h1",
  look: "error",
  content: "Error message",
};
const submitButtonLabel = "Teilnehmen";
const fieldLabel = "Email (optional)";
const fieldDescription = "Lorem ipsum";

function renderEmailCapture(props?: Partial<EmailCaptureProps>) {
  return render(
    <EmailCapture
      successBanner={successBanner}
      errorBanner={errorBanner}
      buttonLabel={submitButtonLabel}
      label={fieldLabel}
      description={fieldDescription}
      {...props}
    />,
  );
}

describe("EmailCapture", () => {
  it("should render the Email Capture component", () => {
    const { getByRole, getByText, getByTestId, getByLabelText } =
      renderEmailCapture();
    expect(getByTestId("email-capture-form")).toBeInTheDocument();
    const submitButton = getByRole("button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent(submitButtonLabel);

    const emailField = getByLabelText(fieldLabel);
    expect(emailField).toBeInTheDocument();
    expect(emailField).toHaveClass("ds-input forced-color-adjust-none");
    expect(getByText(fieldDescription)).toBeInTheDocument();
  });

  describe("Error message state", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should display an error when the field is invalid", () => {
      mockedFieldError.mockReturnValue("Unable to validate");
      const { getByText } = renderEmailCapture();
      expect(getByText(invalidEmailError.text)).toBeInTheDocument();
    });

    it("should display an error when the action returns a validation error flag", () => {
      vi.mocked(useLocation).mockReturnValue({
        pathname: "",
        search: "?invalid",
        state: "",
        key: "",
        hash: "",
      });
      const { getByText } = renderEmailCapture();
      expect(getByText(invalidEmailError.text)).toBeInTheDocument();
    });
  });

  describe("Success state", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should display a success state when the user has consented to email capture", () => {
      vi.mocked(useLocation).mockReturnValue({
        pathname: "",
        search: "?success",
        state: "",
        key: "",
        hash: "",
      });
      const { getByText } = renderEmailCapture();
      expect(getByText(successBanner.content!)).toBeInTheDocument();
    });

    it("should display a success state if a user has previously consented (session storage)", () => {
      vi.mocked(useLoaderData).mockReturnValue({
        csrf: "csrf",
        emailCaptureConsent: true,
      });
      const { getByText } = renderEmailCapture();
      expect(getByText(successBanner.content!)).toBeInTheDocument();
    });
  });
});
