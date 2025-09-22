import type { Meta, StoryObj } from "@storybook/react";
import Container from "~/components/layout/Container";
import { mocked } from "storybook/test";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { PostHog, Survey, SurveyQuestionType } from "posthog-js";
import { useAnalytics } from "~/services/analytics/useAnalytics";

const meta = {
  title: "Component/ReportProblem",
  component: ReportProblem,
  beforeEach: async () => {
    mocked(fetchSurvey).mockReturnValue({
      id: "0",
      questions: [
        {
          id: "1",
          type: SurveyQuestionType.MultipleChoice,
          choices: ["Choice 1", "Choice 2", "Choice 3"],
          question: "Multiple Choice Question",
        },
        {
          id: "2",
          type: SurveyQuestionType.Open,
          question: "Open Question",
          description: "Please answer me:)",
        },
      ],
    } as unknown as Survey);
    mocked(useAnalytics).mockReturnValue({
      posthogClient: {
        capture: () => {},
      } as unknown as PostHog,
    });
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ReportProblem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  decorators: [
    (Story) => (
      <div className="h-[600px]">
        <Container paddingTop="32" paddingBottom="40">
          <Story />
        </Container>
      </div>
    ),
  ],
  args: {},
};
