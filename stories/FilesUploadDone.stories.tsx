import type { Meta, StoryObj } from "@storybook/react";
import { FilesUploadDone } from "~/components/filesUpload/FilesUploadDone";

const meta = {
  title: "Component/FilesUploadDone",
  component: FilesUploadDone,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUploadDone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: "file1.pdf",
    fileSize: 3145728,
    deleteButtonLabel: "Delete",
    selectMoreFilesButtonLabel: "Select more files",
  },
};
