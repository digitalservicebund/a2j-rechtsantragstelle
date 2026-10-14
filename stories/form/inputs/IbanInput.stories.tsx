import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import IbanInput from "~/components/formElements/inputs/iban/IbanInput";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { kontopfaendungPkontoAntragPages } from "~/domains/kontopfaendung/pkonto/antrag/pages";

const meta = {
  title: "form/inputs/IbanInput",
  component: IbanInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
    },
  },
} satisfies Meta<typeof IbanInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "iban",

    controlledFieldConfig:
      kontopfaendungPkontoAntragPages.bankdatenKontodaten.controlledFieldConfig,

    size: "medium",
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem
              smColumn={{ start: 1, span: 12 }}
              mdColumn={{ start: 1, span: 8 }}
              lgColumn={{ start: 3, span: 8 }}
              xlColumn={{ start: 3, span: 8 }}
            >
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
};
