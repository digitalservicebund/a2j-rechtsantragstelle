import type { Meta, StoryObj } from "@storybook/react";
import { FilesUploadInput } from "~/components/filesUpload/FilesUploadInput";

const meta = {
  title: "Component/FilesUploadInput",
  component: FilesUploadInput,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUploadInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fieldName: "uploadFiles",
    selectFilesButtonLabel: "Select Files",
  },
};
