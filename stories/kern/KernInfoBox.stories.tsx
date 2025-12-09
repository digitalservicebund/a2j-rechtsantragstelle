import type { Meta, StoryObj } from "@storybook/react-vite";
import KernInfoBox from "~/components/kern/KernInfoBox";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "kern/KernInfoBox",
  component: KernInfoBox,
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
} satisfies Meta<typeof KernInfoBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleItem: Story = {
  args: {
    heading: {
      text: "Information Section",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        label: {
          text: "Step 1",
          tagName: "p",
        },
        headline: {
          text: "Getting Started",
          tagName: "h3",
        },
        content:
          "<p>This is a simple info box item with label, headline, and content.</p>",
      },
    ],
  },
};

export const MultipleItems: Story = {
  args: {
    heading: {
      text: "Application Process",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        label: {
          text: "Step 1",
          tagName: "p",
        },
        headline: {
          text: "Prepare Documents",
          tagName: "h3",
        },
        content:
          "<p>Gather all necessary documents including identification and proof of address.</p>",
      },
      {
        id: 2,
        label: {
          text: "Step 2",
          tagName: "p",
        },
        headline: {
          text: "Fill Out Form",
          tagName: "h3",
        },
        content:
          "<p>Complete the application form with accurate information.</p>",
      },
      {
        id: 3,
        label: {
          text: "Step 3",
          tagName: "p",
        },
        headline: {
          text: "Submit Application",
          tagName: "h3",
        },
        content: "<p>Review your application and submit it for processing.</p>",
      },
    ],
  },
};

export const WithImages: Story = {
  args: {
    heading: {
      text: "Our Services",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        image: {
          url: bucketUrl + "/bmj_logo_3fd953f074.png",
          alternativeText: "Service icon",
        },
        headline: {
          text: "Legal Consultation",
          tagName: "h3",
        },
        content: "<p>Get expert legal advice for your case.</p>",
      },
      {
        id: 2,
        image: {
          url: bucketUrl + "/bmj_logo_3fd953f074.png",
          alternativeText: "Service icon",
        },
        headline: {
          text: "Document Preparation",
          tagName: "h3",
        },
        content: "<p>We help you prepare all required legal documents.</p>",
      },
    ],
  },
};

export const WithButtons: Story = {
  args: {
    heading: {
      text: "Get Started",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        headline: {
          text: "New Application",
          tagName: "h3",
        },
        content: "<p>Start a new application process from scratch.</p>",
        buttons: [
          {
            text: "Start New Application",
            look: "primary",
          },
        ],
      },
      {
        id: 2,
        headline: {
          text: "Continue Existing",
          tagName: "h3",
        },
        content: "<p>Pick up where you left off with a saved application.</p>",
        buttons: [
          {
            text: "Continue",
            look: "secondary",
          },
        ],
      },
    ],
  },
};

export const WithDetails: Story = {
  args: {
    heading: {
      text: "Requirements Overview",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        headline: {
          text: "Document Checklist",
          tagName: "h3",
        },
        content: "<p>Please ensure you have the following documents ready:</p>",
        details: [
          {
            title: "Personal Identification",
            content: "Valid passport or national ID card",
          },
          {
            title: "Proof of Address",
            content:
              "Recent utility bill or bank statement (not older than 3 months)",
          },
          {
            title: "Income Documentation",
            content: "Recent pay slips or tax documents",
          },
        ],
      },
    ],
  },
};

export const WithInlineNotices: Story = {
  args: {
    heading: {
      text: "Important Information",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        headline: {
          text: "Application Guidelines",
          tagName: "h3",
        },
        content:
          "<p>Please review the following important notices before proceeding.</p>",
        inlineNotices: [
          {
            title: "Processing Time",
            tagName: "p",
            look: "tips",
            content: "Applications typically take 2-4 weeks to process.",
          },
          {
            title: "Required Documents",
            tagName: "p",
            look: "warning",
            content: "Missing documents may delay your application.",
          },
        ],
      },
    ],
  },
};

export const WithoutHeading: Story = {
  args: {
    items: [
      {
        id: 1,
        headline: {
          text: "Quick Tip",
          tagName: "h3",
        },
        content: "<p>Info box without a main heading, showing only items.</p>",
      },
      {
        id: 2,
        headline: {
          text: "Another Tip",
          tagName: "h3",
        },
        content:
          "<p>You can have multiple items without a container heading.</p>",
      },
    ],
  },
};

export const WithContent: Story = {
  args: {
    heading: {
      text: "Schritt für Schritt zur anwaltlichen Beratung",
      tagName: "h2",
    },
    items: [
      {
        id: 1,
        label: {
          text: "Optional Label",
          tagName: "p",
        },
        headline: {
          text: "Headline Lorem Ipsum",
          tagName: "h3",
        },
        content: `<p>Bodytext Lorem Ipsum</p>
<ul>
  <li>Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus</li>
  <li>Curabitur tempor quis eros tempus lacinia.</li>
  <li>Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec, fermentum congue felis.</li>
</ul>`,
      },
    ],
  },
};
