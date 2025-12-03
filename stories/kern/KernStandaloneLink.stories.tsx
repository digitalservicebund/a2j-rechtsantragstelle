import type { Meta, StoryObj } from "@storybook/react-vite";
import { KernStandaloneLink } from "~/components/content/kern/KernStandaloneLink";

const meta = {
  title: "kern/KernStandaloneLink",
  component: KernStandaloneLink,
  tags: ["autodocs"],
} satisfies Meta<typeof KernStandaloneLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InternalLink: Story = {
  args: {
    text: "Internal Link",
    url: "/beratungshilfe",
  },
};

export const ExternalLink: Story = {
  args: {
    text: "External Link",
    url: "https://example.com",
  },
};

export const FileDownloadLink: Story = {
  args: {
    text: "Download PDF",
    url: "/documents/example.pdf",
  },
};

export const WithIcon: Story = {
  args: {
    text: "Link with Icon",
    url: "/beratungshilfe",
    icon: <span className="kern-icon kern-icon--home" />,
  },
};
