import type { Meta, StoryObj } from "@storybook/react-vite";
import KernInfoBox, {
  type KernInfoBoxProps,
} from "~/components/kern/KernInfoBox";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "KERN/InfoBox",
  component: KernInfoBox,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernInfoBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  identifier: "default-info-box-id",
  heading: {
    text: "Heading text",
    tagName: "h2",
    look: "ds-heading-03-bold",
  },
  items: [
    {
      id: 10,
      label: { text: "Label", look: "ds-label-01-reg" },
      headline: { text: "Headline", look: "ds-heading-03-reg" },
      image: undefined,
      content: `
        <p>Bitte haben Sie Verständnis, dass die Erteilung von Rechtsauskünften oder die Unterstützung in Angelegenheiten der individuellen Rechtsverfolgung nicht Teil unseres Angebots sind. Die Rechtsberatung ist Aufgabe von Rechtsanwältinnen und Rechtsanwälten und anderer, dazu besonders befugter Personen und Stellen.</p><ul><li>First item</li><li>Second item</li><li>Third item</li></ul>
        `,
      buttons: [{ text: "Button 1", look: "tertiary" }, { text: "Button 2" }],
    },
  ],
} satisfies KernInfoBoxProps;

export const Default: Story = {
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-darkblue-500">
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
  args: defaultArgs,
};

export const WithImage: Story = {
  decorators: [
    (Story) => (
      <GridSection className="bg-kern-darkblue-500">
        <Grid>
          <div>
            <Story />
          </div>
        </Grid>
      </GridSection>
    ),
  ],
  args: {
    ...defaultArgs,
    items: [
      {
        id: 12,
        label: { text: "Label", look: "ds-label-01-reg" },
        headline: { text: "Headline", look: "ds-heading-03-reg" },
        image: {
          url: bucketUrl + "/bmj_logo_3fd953f074.png",
          width: 240,
          height: 132,
          alternativeText: "Logo des Bundesministerium der Justiz",
        },
        content:
          "* First bullet point item\n* Second bullet point item\n* Third bullet point item",
        buttons: [
          { text: "Button 1", look: "tertiary" as const },
          { text: "Button 2" },
        ],
      },
    ],
  },
};
