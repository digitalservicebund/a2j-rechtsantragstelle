import type { Meta, StoryObj } from "@storybook/react";
import { FilesUploadInProgress } from "~/components/filesUpload/FilesUploadInProgress";

const meta = {
  title: "Component/FilesUploadInProgress",
  component: FilesUploadInProgress,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUploadInProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: "file1.pdf",
    cancelButtonLabel: "Cancel",
    uploadProgressLabel: "loading...",
    selectMoreFilesButtonLabel: "Select more files",
  },
};
