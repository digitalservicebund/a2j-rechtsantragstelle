import type { Meta, StoryObj } from "@storybook/react-vite";
import Container from "~/components/layout/Container";
import { mocked } from "storybook/test";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { SurveyQuestionType, type PostHog, type Survey } from "posthog-js";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";

const meta = {
  title: "KERN/KernReportProblem",
  component: KernReportProblem,
  beforeEach: async () => {
    mocked(fetchSurvey).mockReturnValue({
      id: "0",
      questions: [
        {
          id: "1",
          type: SurveyQuestionType.MultipleChoice,
          choices: [
            "Question is not clear",
            "Question does not apply to my situation",
            "Technical Problem",
            "Other",
          ],
          question: "Are there any problems with this page?",
        },
        {
          id: "2",
          type: SurveyQuestionType.Open,
          question: "Help us understand the problem better - Optional",
          description:
            "Please do not enter any personal data. Your feedback will be recorded anonymously.",
        },
      ],
    } as unknown as Survey);
    mocked(useAnalytics).mockReturnValue({
      posthogClient: {
        // oxlint-disable-next-line no-empty-function
        capture: () => {},
      } as unknown as PostHog,
    });
  },
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernReportProblem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem className="pb-40 flex">
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
  args: {},
};
