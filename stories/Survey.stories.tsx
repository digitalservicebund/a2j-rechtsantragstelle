import type { Meta, StoryObj } from "@storybook/react";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { SurveyQuestionType } from "posthog-js";
import Background from "~/components/Background";
import Container from "~/components/Container";

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
      <Background paddingTop="32" paddingBottom="32">
        <Container paddingTop="32" paddingBottom="40">
          <Story />
        </Container>
      </Background>
    ),
  ],
  args: {
    survey: {
      id: "",
      questions: [
        {
          id: "",
          type: SurveyQuestionType.MultipleChoice,
          choices: ["Choice 1", "Choice 2", "Choice 3"],
          question: "Multiple Choice Question",
        },
        {
          id: "",
          type: SurveyQuestionType.Open,
          question: "Open Question",
          description: "Please answer me:)",
        },
      ],
    },
    closeSurvey: () => undefined,
    styleOverrides: "relative",
  },
};
