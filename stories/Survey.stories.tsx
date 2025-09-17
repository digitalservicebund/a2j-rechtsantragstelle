import type { Meta, StoryObj } from "@storybook/react";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { SurveyQuestionType } from "posthog-js";
import Container from "~/components/layout/Container";

const meta = {
  title: "Component/Survey",
  component: PosthogSurvey,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PosthogSurvey>;

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
  args: {
    wasSubmitted: false,
    submitFeedback: () => undefined,
    closeSurvey: () => undefined,
    survey: {
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
    },
  },
};
