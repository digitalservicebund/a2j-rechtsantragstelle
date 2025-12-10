import type { Meta, StoryObj } from "@storybook/react-vite";
import KernAccordion from "~/components/kern/KernAccordion";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "kern/KernAccordion",
  component: KernAccordion,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>{reactRouterContext(Story)}</GridItem>
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: "Was ist eine Rechtsberatung?",
        description:
          "<p>Eine Rechtsberatung ist eine professionelle Dienstleistung, bei der ein Rechtsanwalt oder eine Rechtsanwältin Sie zu rechtlichen Fragen berät und Ihnen bei der Lösung rechtlicher Probleme hilft.</p>",
      },
    ],
  },
};

export const MultipleItems: Story = {
  args: {
    items: [
      {
        title: "Was ist eine Rechtsberatung?",
        description:
          "<p>Eine Rechtsberatung ist eine professionelle Dienstleistung, bei der ein Rechtsanwalt oder eine Rechtsanwältin Sie zu rechtlichen Fragen berät und Ihnen bei der Lösung rechtlicher Probleme hilft.</p>",
      },
      {
        title: "Wer kann eine Rechtsberatung in Anspruch nehmen?",
        description:
          "<p>Jede Person kann eine Rechtsberatung in Anspruch nehmen, unabhängig von ihrer finanziellen Situation. Für Menschen mit geringem Einkommen gibt es die Möglichkeit der Beratungshilfe.</p>",
      },
      {
        title: "Wie beantrage ich Beratungshilfe?",
        description:
          "<p>Sie können Beratungshilfe beim zuständigen Amtsgericht beantragen. Dafür müssen Sie ein Formular ausfüllen und Ihre finanzielle Situation nachweisen. Nach Prüfung erhalten Sie einen Beratungshilfeschein.</p>",
      },
    ],
  },
};

export const WithRichContent: Story = {
  args: {
    items: [
      {
        title: "Welche Dokumente benötige ich?",
        description: `<p>Für die Beratungshilfe benötigen Sie folgende Dokumente:</p>
<ul>
  <li>Personalausweis oder Reisepass</li>
  <li>Einkommensnachweise (z.B. Gehaltsabrechnungen, Rentenbescheide)</li>
  <li>Nachweise über Ausgaben (z.B. Mietvertrag, Versicherungen)</li>
  <li>Beschreibung Ihres rechtlichen Problems</li>
</ul>
<p>Diese Unterlagen helfen dem Gericht, Ihre finanzielle Situation zu prüfen.</p>`,
      },
      {
        title: "Was kostet die Beratung?",
        description: `<p>Die Kosten für eine Rechtsberatung variieren:</p>
<ul>
  <li>Mit Beratungshilfeschein: 15 Euro Eigenanteil</li>
  <li>Ohne Beratungshilfe: Nach Vereinbarung mit dem Anwalt</li>
  <li>Erstberatung: Maximal 190 Euro + Mehrwertsteuer</li>
</ul>`,
      },
    ],
  },
};
