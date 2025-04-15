import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"; // use react-router-dom only for test, the react-router-dom does not work
import { FEEDBACK_FIELD_NAME, FeedbackFormBox } from "../FeedbackFormBox";
import { FeedbackType } from "../FeedbackType";

const SUBMIT_BUTTON_FEEDBACK = "Submit button";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "submit-button-feedback": SUBMIT_BUTTON_FEEDBACK,
  }),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useLocation: () => ({
      pathname: "/",
    }),
  };
});

function renderFeedbackFormBox() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <FeedbackFormBox
            destination="destination"
            shouldFocus={true}
            feedback={FeedbackType.Positive}
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
