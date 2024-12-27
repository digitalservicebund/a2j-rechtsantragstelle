import type { Meta, StoryObj } from "@storybook/react";
import BoxWithImage from "~/components/BoxWithImage";

const meta = {
  title: "Content/BoxWithImage",
  component: BoxWithImage,
  tags: ["autodocs"],
} satisfies Meta<typeof BoxWithImage>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    image: { url: "public/og-image.png" },
    variant: "M",
    heading: {
      text: "Ein Pilotprojekt des Bundesministeriums der Justiz und der Justizministerien der Länder.",
      tagName: "h1",
      look: "ds-label-01-reg",
    },
    content:
      "In diesem Projekt geht es darum, den Zugang zum Recht zu verbessern. Diese Seite befindet sich im Aufbau. Weitere Funktionen und Dienstleistungen werden mit der Zeit ergänzt.",
  },
};
