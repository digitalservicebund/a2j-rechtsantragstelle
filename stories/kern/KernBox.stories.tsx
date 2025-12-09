import type { Meta, StoryObj } from "@storybook/react-vite";
import KernBox from "~/components/kern/KernBox";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta = {
  title: "kern/KernBox",
  component: KernBox,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Grid
          background={{
            mdColumn: { start: 1, span: 8 },
            lgColumn: { start: 2, span: 10 },
            xlColumn: { start: 2, span: 10 },
            className: "rounded-lg bg-kern-neutral-050",
          }}
        >
          <Story />
        </Grid>
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: {
      text: "Label Text",
      tagName: "p",
    },
    heading: {
      text: "Main Heading",
      tagName: "h2",
    },
    content: {
      html: "<p>This is the content area with some explanatory text about the box component.</p>",
    },
  },
};

export const WithButtons: Story = {
  args: {
    label: {
      text: "Get Started",
      tagName: "p",
    },
    heading: {
      text: "Complete Your Application",
      tagName: "h2",
    },
    content: {
      html: "<p>Follow these steps to complete your application process. Make sure you have all required documents ready.</p>",
    },
    buttons: [
      {
        text: "Start Application",
        look: "primary",
      },
      {
        text: "Learn More",
        look: "secondary",
      },
    ],
  },
};

export const OnlyHeading: Story = {
  args: {
    heading: {
      text: "Important Information",
      tagName: "h2",
    },
    content: {
      html: "<p>This box demonstrates content with a heading but no label.</p>",
    },
  },
};

export const OnlyLabel: Story = {
  args: {
    label: {
      text: "Quick Tip",
      tagName: "p",
    },
    content: {
      html: "<p>This box has a label but no main heading, suitable for smaller informational sections.</p>",
    },
  },
};

export const MinimalContent: Story = {
  args: {
    content: {
      html: "<p>Just content, no headings or labels. Perfect for simple text blocks.</p>",
    },
  },
};

export const MultipleButtons: Story = {
  args: {
    heading: {
      text: "Choose Your Next Step",
      tagName: "h2",
    },
    content: {
      html: `
        <p>Select one of the following options to continue:</p>
        <ul>
          <li>Download your documents</li>
          <li>Schedule an appointment</li>
          <li>Contact support for help</li>
        </ul>
      `,
    },
    buttons: [
      {
        text: "Download Documents",
        look: "primary",
        iconLeft: <span className="kern-icon--download" />,
      },
      {
        text: "Schedule Appointment",
        look: "secondary",
      },
      {
        text: "Contact Support",
        look: "tertiary",
      },
    ],
  },
};
