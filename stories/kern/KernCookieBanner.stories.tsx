import { KernCookieBanner } from "~/components/kern/KernCookieBanner";
import type { Meta, StoryObj } from "@storybook/react";
import { reactRouterContext } from ".storybook/reactRouterContext";
import { Grid } from "~/components/layout/grid/Grid";

const meta: Meta<typeof KernCookieBanner> = {
  title: "kern/KernCookieBanner",
  component: KernCookieBanner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernCookieBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [(Story) => <Grid>{reactRouterContext(Story)}</Grid>],
  args: {
    content: {
      heading: { tagName: "h2", text: "Cookie banner heading" },
      paragraphs: [
        { html: "<p>Cookie banner first paragraph.</p>" },
        { html: "<p>Cookie banner second paragraph.</p>" },
      ],
      acceptButtonLabel: "Accept",
      declineButtonLabel: "Decline",
      cookieSettingLinkText: "Cookie settings",
      cookieSettingLinkUrl: "/cookies",
    },
  },
};
