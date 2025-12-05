import type { Meta, StoryObj } from "@storybook/react-vite";
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
          choices: ["Choice 1", "Choice 2", "Choice 3", "Other choice"],
          question: "Question?",
        },
        {
          id: "2",
          type: SurveyQuestionType.Open,
          question: "Open question - Optional",
          description: "Description.",
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
          <GridItem className="pb-40 flex justify-end">
            <Story />
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
  args: {},
};
