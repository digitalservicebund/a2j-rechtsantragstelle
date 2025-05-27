import { randomUUID } from "crypto";
import { fireEvent, render } from "@testing-library/react";
import { SurveyQuestionType, type BasicSurveyQuestion } from "posthog-js";
import { OpenQuestion } from "../OpenQuestion";

const mockSetResponses = vi.fn();
const questionText = "Some very important question.";
const descriptionText = "An even more important description";
const placeholderText = "Beschreibung des Problems....";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "open-feedback-placeholder": placeholderText,
  }),
}));

describe("OpenQuestion", () => {
  it("should render a basic open question", () => {
    const question: BasicSurveyQuestion = {
      id: randomUUID(),
      type: SurveyQuestionType.Open,
      question: questionText,
      description: descriptionText,
    };
    const { getByText, getByPlaceholderText, getByRole } = render(
      <OpenQuestion question={question} setResponses={mockSetResponses} />,
    );
    expect(getByText(questionText)).toBeInTheDocument();
    expect(getByText(descriptionText)).toBeInTheDocument();
    expect(getByPlaceholderText(placeholderText)).toBeInTheDocument();
    expect(getByRole("textbox")).toBeInTheDocument();
    fireEvent.change(getByRole("textbox"), { target: { value: "Feedback" } });
    expect(mockSetResponses).toHaveBeenCalled();
  });
});
