import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";
import KernTextarea from "~/components/kern/formElements/Textarea";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";

const meta = {
  title: "kern/formElements/KernTextarea",
  component: KernTextarea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
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
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernTextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "feedback",
    label: "Ihr Feedback",
    placeholder: "Bitte geben Sie hier Ihr Feedback ein...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDescription: Story = {
  args: {
    name: "comment",
    label: "Kommentar",
    description:
      "<p>Bitte teilen Sie uns Ihre Meinung mit. Ihre Rückmeldung hilft uns, unseren Service zu verbessern.</p>",
    placeholder: "Ihre Nachricht...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithDetails: Story = {
  args: {
    name: "message",
    label: "Nachricht",
    details: {
      title: "Was sollte ich schreiben?",
      content:
        "Beschreiben Sie Ihr Anliegen möglichst genau. Je mehr Details Sie angeben, desto besser können wir Ihnen helfen.",
    },
    placeholder: "Beschreiben Sie Ihr Anliegen...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

export const WithAllFeatures: Story = {
  args: {
    name: "detailed-feedback",
    label: "Ausführliches Feedback",
    description:
      "<p><strong>Hinweis:</strong> Bitte geben Sie keine persönlichen Daten wie Telefonnummern oder E-Mail-Adressen ein.</p>",
    details: {
      title: "Datenschutzhinweis",
      content:
        "Ihre Eingaben werden anonym gespeichert und nur zur Verbesserung unseres Services verwendet.",
    },
    placeholder: "Ihr ausführliches Feedback...",
    maxLength: 500,
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};

const errorSchema = z.object({
  "error-example": z
    .string()
    .min(1, { message: "required" })
    .max(10, { message: "max" }),
});

export const WithError: Story = {
  args: {
    name: "error-example",
    label: "Pflichtfeld",
    placeholder: "Dieses Feld ist erforderlich",
    errorMessages: [
      { code: "required", text: "Dieses Feld muss ausgefüllt werden" },
      { code: "max", text: "Der Text ist zu lang (maximal 10 Zeichen)" },
    ],
  },
  decorators: [(Story) => reactRouterFormContext(<Story />, errorSchema)],
};

export const MinimalExample: Story = {
  args: {
    name: "minimal",
    placeholder: "Einfaches Textfeld ohne Label...",
  },
  decorators: [(Story) => reactRouterFormContext(<Story />)],
};
