import type { Meta, StoryObj } from "@storybook/react-vite";
import { KernDetails } from "~/components/kern/KernDetails";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernDetails",
  component: KernDetails,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Was ist eine Rechtsberatung?",
    content:
      "<p>Eine Rechtsberatung ist eine professionelle Dienstleistung, bei der ein Rechtsanwalt oder eine Rechtsanwältin Sie zu rechtlichen Fragen berät und Ihnen bei der Lösung rechtlicher Probleme hilft.</p>",
  },
};

export const WithRichContent: Story = {
  args: {
    title: "Welche Dokumente benötige ich?",
    content: `<p>Für die Beratungshilfe benötigen Sie folgende Dokumente:</p>
<ul>
  <li>Personalausweis oder Reisepass</li>
  <li>Einkommensnachweise (z.B. Gehaltsabrechnungen, Rentenbescheide)</li>
  <li>Nachweise über Ausgaben (z.B. Mietvertrag, Versicherungen)</li>
  <li>Beschreibung Ihres rechtlichen Problems</li>
</ul>
<p>Diese Unterlagen helfen dem Gericht, Ihre finanzielle Situation zu prüfen.</p>`,
  },
};

