import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import AutoSuggestInput from "~/components/formElements/autoSuggestInput/AutoSuggestInput";

const meta = {
  title: "form/AutoSuggestionInput",
  component: AutoSuggestInput,
  tags: ["autodocs"],
} satisfies Meta<typeof AutoSuggestInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Airports: Story = {
  args: {
    name: "airport",
    label: "Abflughafen",
    placeholder: "z.B. Berlin Brandenburg (BER)",
    dataList: "airports",
    isDisabled: false,
    noSuggestionMessage: "Kein Flughafen gefunden",
    minSuggestCharacters: 3,
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem>
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
};

export const WithHelperText: Story = {
  args: {
    name: "airport-helper",
    label: "Abflughafen",
    placeholder: "z.B. Berlin Brandenburg (BER)",
    dataList: "airports",
    isDisabled: false,
    noSuggestionMessage: "Kein Flughafen gefunden",
    helperText: "Geben Sie mindestens 3 Zeichen ein, um Vorschläge zu sehen.",
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem>
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
};
