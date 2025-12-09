import type { Meta, StoryObj } from "@storybook/react-vite";
import { KernInlineNotice } from "~/components/kern/KernInlineNotice";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernInlineNotice",
  component: KernInlineNotice,
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
} satisfies Meta<typeof KernInlineNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    title: "Warnung",
    tagName: "h3",
    look: "warning",
    content:
      "<p>Die Beschreibung einer inline notice liefert mehr Kontext und sollte darüber hinaus auch Handlungsoptionen aufzeigen, falls nötig.</p>",
  },
};

export const Tips: Story = {
  args: {
    title: "Hinweis",
    tagName: "h3",
    look: "tips",
    content:
      "<p>Die Beschreibung einer inline notice liefert mehr Kontext und sollte darüber hinaus auch Handlungsoptionen aufzeigen, falls nötig.</p>",
  },
};

export const Success: Story = {
  args: {
    title: "Erfolg",
    tagName: "h3",
    look: "success",
    content:
      "<p>Die Beschreibung einer inline notice liefert mehr Kontext und sollte darüber hinaus auch Handlungsoptionen aufzeigen, falls nötig.</p>",
  },
};

export const Error: Story = {
  args: {
    title: "Fehler",
    tagName: "h3",
    look: "error",
    content:
      "<p>Die Beschreibung einer inline notice liefert mehr Kontext und sollte darüber hinaus auch Handlungsoptionen aufzeigen, falls nötig.</p>",
  },
};
