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
    heading: {
      text: "Heading text",
      tagName: "h2",
      look: "ds-heading-03-bold",
    },
    content: `Non blanditiis vel quis. A molestias id quia modi veniam sunt. Quia eligendi quos ut.

Totam quis saepe sed qui in. Beatae occaecati et aperiam non iusto sequi. Ut nihil similique aut magni neque.

- Laboriosam quae esse libero eum. Iure et veritatis voluptates. Fugiat voluptates sunt aperiam accusantium ab voluptatum doloribus veniam. Maiores esse et est.
- Quia distinctio earum accusamus aut ullam aut. Porro quis beatae ut rerum quas nemo itaque sed. Dolores voluptates in laborum deserunt cupiditate pariatur est.

Est perspiciatis blanditiis aliquam. Ut perferendis et illo eligendi aliquid. Est mollitia vel molestiae. Enim sed eius et saepe voluptatem occaecati quasi voluptas.`,
  },
};
