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
    uploadFile: async (file: File) => {
      return new Promise<void>((resolve) => setTimeout(resolve, 1000));
    },

    labels: {
      deleteButtonLabel: "Delete",
      selectMoreFilesButtonLabel: "Select more files",
      cancelButtonLabel: "Cancel",
      uploadProgressLabel: "loading...",
      selectFilesButtonLabel: "Select files",
    },
    inputName: "file",
    description: "Description",
    title: "Title",
    warningTitle: "Warning title",
    warningDescription: "Warning description",
  },
};
