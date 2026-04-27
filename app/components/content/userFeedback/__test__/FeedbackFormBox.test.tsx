import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"; // use react-router-dom only for test, the react-router does not work
import { FeedbackFormBox, FEEDBACK_FIELD_NAME } from "../FeedbackFormBox";

const SUBMIT_BUTTON_FEEDBACK = "Submit button";

vi.mock("~/components/content/userFeedback/feedbackTranslations.ts", () => ({
  useFeedbackTranslations: () => ({
    "submit-button-feedback": SUBMIT_BUTTON_FEEDBACK,
  }),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useRouteLoaderData: () => ({
      csrfToken: "test-token",
    }),
    useLocation: () => ({
      pathname: "/",
      search: "",
    }),
  };
});

vi.mock("~/components/formElements/CsrfInput", () => ({
  CsrfInput: () => null,
}));

function renderFeedbackFormBox() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <FeedbackFormBox
            destination="destination"
            shouldFocus={true}
            feedback={"positive"}
            onSubmit={vitest.fn}
          />
        ),

        action() {
          return true;
        },
      },
    ],
    {
      initialEntries: ["/"],
    },
  );
  return render(<RouterProvider router={router} />);
}

describe("FeedbackFormBox", () => {
  it("should render the component with the given translations", () => {
    const { getByText } = renderFeedbackFormBox();

    expect(getByText(SUBMIT_BUTTON_FEEDBACK)).toBeInTheDocument();
  });

  it("should render the component with the focus on the text area ", () => {
    const { container } = renderFeedbackFormBox();

    expect(container.querySelector(`#${FEEDBACK_FIELD_NAME}`)).toHaveFocus();
  });
});
