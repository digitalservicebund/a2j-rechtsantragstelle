import type { Meta, StoryObj } from "@storybook/react";
import { FilesUpload } from "~/components/filesUpload/FilesUpload";

const meta = {
  title: "Component/FilesUpload",
  component: FilesUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: "file1.pdf",
    fileSize: 3145728,
    deleteButtonLabel: "Delete",
    selectMoreFilesButtonLabel: "Select more files",
    inputName: "file",
    description: "Description",
    title: "Title",
    warningTitle: "Warning title",
    errorMessage: "Error message",
    cancelButtonLabel: "Cancel",
    warningDescription: "Warning description",
    uploadProgressLabel: "Upload progress",
    selectFilesButtonLabel: "Select files",
  },
};
