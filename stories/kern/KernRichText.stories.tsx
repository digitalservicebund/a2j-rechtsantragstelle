import type { Meta, StoryObj } from "@storybook/react-vite";
import KernRichText from "~/components/kern/KernRichText";

const meta = {
  title: "kern/KernRichText",
  component: KernRichText,
  tags: ["autodocs"],
} satisfies Meta<typeof KernRichText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SimpleParagraph: Story = {
  args: {
    html: "<p>This is a simple paragraph with some text content.</p>",
  },
};

export const MultipleParagraphs: Story = {
  args: {
    html: `
      <p>This is the first paragraph with some text content.</p>
      <p>This is the second paragraph with more text content.</p>
      <p>And here's a third paragraph to demonstrate spacing.</p>
    `,
  },
};

export const WithFormatting: Story = {
  args: {
    html: `
      <p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p>
      <p>You can also have <a href="https://example.com">links</a> in the content.</p>
    `,
  },
};

export const WithList: Story = {
  args: {
    html: `
      <p>Here's a list of items:</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
      <p>And an ordered list:</p>
      <ol>
        <li>First step</li>
        <li>Second step</li>
        <li>Third step</li>
      </ol>
    `,
  },
};
