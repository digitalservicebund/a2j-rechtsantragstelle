import { randomUUID } from "crypto";
import { fireEvent, render } from "@testing-library/react";
import { type MultipleSurveyQuestion, SurveyQuestionType } from "posthog-js";
import { MultipleChoiceQuestion } from "~/components/userFeedback/reportProblem/MultipleChoiceQuestion";

const mockSetResponses = vi.fn();

describe("MultipleChoiceQuestion", () => {
  it("should render all options as checkboxes", () => {
    const question: MultipleSurveyQuestion = {
      id: randomUUID(),
      choices: ["Option 1", "Option 2", "Option 3"],
      type: SurveyQuestionType.MultipleChoice,
      question: "",
    };
    const { getByText, getAllByRole } = render(
      <MultipleChoiceQuestion
        question={question}
        setResponses={mockSetResponses}
      />,
    );
    expect(getByText("Option 1")).toBeInTheDocument();
    expect(getAllByRole("checkbox")).toHaveLength(3);
    fireEvent.click(getAllByRole("checkbox")[1]);
    expect(mockSetResponses).toHaveBeenCalled();
  });
});
