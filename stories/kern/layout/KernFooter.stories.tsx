import type { Meta, StoryObj } from "@storybook/react-vite";
import KernFooter from "~/components/kern/layout/footer/KernFooter";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "kern/layout/KernFooter",
  component: KernFooter,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GridSection>
        <Story />
      </GridSection>
    ),
  ],
} satisfies Meta<typeof KernFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "Bundesministerium der Justiz",
    },
    categorizedLinks: [
      {
        id: 1,
        title: "Rechtliche Hinweise",
        links: [
          {
            url: "/impressum",
            text: "Impressum",
          },
          {
            url: "/barrierefreiheit",
            text: "Barrierefreiheit",
          },
        ],
      },
      {
        id: 2,
        title: "Datenschutzerklärungen",
        links: [
          {
            url: "/datenschutz",
            text: "service.justiz.de Datenschutz",
          },
          {
            url: "/beratungshilfe-datenschutz",
            text: "Beratungshilfe Datenschutz",
          },
          {
            url: "/prozesskostenhilfe-datenschutz",
            text: "Prozesskostenhilfe Datenschutz",
          },
          {
            url: "/fluggastrechte-datenschutz",
            text: "Fluggastrechte Datenschutz",
          },
        ],
      },
      {
        id: 3,
        title: "Kontakt und Teilnahme",
        links: [
          {
            url: "/kontakt",
            text: "Kontakt",
          },
          {
            url: "https://github.com/digitalservicebund/a2j-rechtsantragstelle",
            text: "Open Source Code",
          },
        ],
      },
    ],
    showDeletionBanner: false,
  },
};

export const WithDeletionBanner: Story = {
  args: {
    ...Default.args,
    showDeletionBanner: true,
  },
};
