import type { Meta, StoryObj } from "@storybook/react";
import { FilesUploadWarning } from "~/components/filesUpload/FilesUploadWarning";

const meta = {
  title: "Component/FilesUploadWarning",
  component: FilesUploadWarning,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUploadWarning>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    warningTitle: "Warning",
    warningDescription: "You can only upload 5 files at a time.",
  },
};
