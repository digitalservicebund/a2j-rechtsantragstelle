import { remixContext } from ".storybook/remixContext";
import type { Meta, StoryObj } from "@storybook/react";
import FilesUpload from "~/components/filesUpload/FilesUpload";

const meta = {
  title: "Component/FilesUpload",
  component: FilesUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "file upload",
    title: "Upload your files",
  },
  decorators: [(Story) => remixContext(Story)],
};
