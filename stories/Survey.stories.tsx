import type { Meta, StoryObj } from "@storybook/react";
import { PosthogSurvey } from "~/components/userFeedback/reportProblem/Survey";
import { TranslationContext } from "~/services/translations/translationsContext";
import { SurveyQuestionType, SurveyType } from "posthog-js";
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
      <TranslationContext.Provider
        value={{
          fileUpload: {},
          feedback: {
            "report-problem": "Problem melden",
            cancel: "Abbrechen",
            "submit-problem": "Problem absenden",
            "open-feedback-placeholder": "Beschreibung des Problems....",
          },
          video: {},
          accessibility: {},
          accordion: {},
        }}
      >
        <Background paddingTop="32" paddingBottom="32">
          <Container paddingTop="32" paddingBottom="40">
            <Story />
          </Container>
        </Background>
      </TranslationContext.Provider>
    ),
  ],
  args: {
    survey: {
      id: "",
      name: "",
      description: "",
      type: SurveyType.Popover,
      feature_flag_keys: null,
      linked_flag_key: null,
      targeting_flag_key: null,
      internal_targeting_flag_key: null,
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
      appearance: null,
      conditions: null,
      start_date: null,
      end_date: null,
      current_iteration: null,
      current_iteration_start_date: null,
    },
    closeSurvey: () => undefined,
    styleOverrides: "relative",
  },
};
