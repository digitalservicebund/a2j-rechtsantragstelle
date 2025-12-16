import { KernCookieBanner } from "~/components/kern/KernCookieBanner";
import { reactRouterContext } from ".storybook/reactRouterContext";
import { Grid } from "~/components/layout/grid/Grid";
import { Meta, StoryObj } from "@storybook/react-vite";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";

const meta: Meta<typeof KernCookieBanner> = {
  title: "kern/KernCookieBanner",
  component: KernCookieBanner,
  tags: ["autodocs"],
} satisfies Meta<typeof KernCookieBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <GridSection>
        <Grid>
          <GridItem>
            <div style={{ minHeight: "40vh", position: "relative" }}>
              {reactRouterContext(Story)}
            </div>
          </GridItem>
        </Grid>
      </GridSection>
    ),
  ],
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
