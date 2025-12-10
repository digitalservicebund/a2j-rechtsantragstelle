import type { Meta, StoryObj } from "@storybook/react-vite";
import KernBoxWithImage from "~/components/kern/KernBoxWithImage";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "kern/KernBoxWithImage",
  component: KernBoxWithImage,
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
} satisfies Meta<typeof KernBoxWithImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExtraSmall: Story = {
  args: {
    variant: "XS",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content:
      "<p>Das Bundesministerium der Justiz ist für die Rechtspflege in Deutschland zuständig.</p>",
  },
};

export const Small: Story = {
  args: {
    variant: "S",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content:
      "<p>Das Bundesministerium der Justiz ist für die Rechtspflege in Deutschland zuständig.</p>",
  },
};

export const Medium: Story = {
  args: {
    variant: "M",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content:
      "<p>Das Bundesministerium der Justiz ist für die Rechtspflege in Deutschland zuständig und setzt sich für einen modernen Rechtsstaat ein.</p>",
  },
};

export const Large: Story = {
  args: {
    variant: "L",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content: `<p>Das Bundesministerium der Justiz ist für die Rechtspflege in Deutschland zuständig und setzt sich für einen modernen Rechtsstaat ein.</p>
<p>Zu den Aufgaben gehören:</p>
<ul>
  <li>Gesetzgebung im Bereich des Zivil- und Strafrechts</li>
  <li>Verwaltung der Bundesgerichte</li>
  <li>Justizpolitische Zusammenarbeit auf europäischer und internationaler Ebene</li>
</ul>`,
  },
};

export const ExtraLarge: Story = {
  args: {
    variant: "XL",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content: `<p>Das Bundesministerium der Justiz ist die oberste Bundesbehörde für die Rechtspflege in Deutschland.</p>
<p>Zu den Hauptaufgaben gehören:</p>
<ul>
  <li>Gesetzgebung im Bereich des Zivil- und Strafrechts</li>
  <li>Verwaltung der Bundesgerichte</li>
  <li>Justizpolitische Zusammenarbeit auf europäischer und internationaler Ebene</li>
  <li>Förderung der Rechtssicherheit und Rechtsstaatlichkeit</li>
</ul>
<p>Das Ministerium arbeitet eng mit den Justizministerien der Bundesländer zusammen.</p>`,
  },
};

export const ExtraExtraLarge: Story = {
  args: {
    variant: "XXL",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
    heading: {
      text: "Bundesministerium der Justiz",
      tagName: "h3",
    },
    content: `<p>Das Bundesministerium der Justiz ist die oberste Bundesbehörde für die Rechtspflege in Deutschland und hat seinen Sitz in Berlin.</p>
<p>Zu den Hauptaufgaben gehören:</p>
<ul>
  <li>Gesetzgebung im Bereich des Zivil- und Strafrechts</li>
  <li>Verwaltung der Bundesgerichte wie des Bundesgerichtshofs</li>
  <li>Justizpolitische Zusammenarbeit auf europäischer und internationaler Ebene</li>
  <li>Förderung der Rechtssicherheit und Rechtsstaatlichkeit</li>
  <li>Verbraucherschutz und Insolvenzrecht</li>
</ul>
<p>Das Ministerium arbeitet eng mit den Justizministerien der Bundesländer zusammen und ist zuständig für die Weiterentwicklung des deutschen Rechtssystems.</p>`,
  },
};

export const ImageOnly: Story = {
  args: {
    variant: "M",
    image: {
      url: bucketUrl + "/bmj_logo_3fd953f074.png",
      alternativeText: "BMJ Logo",
    },
  },
};
