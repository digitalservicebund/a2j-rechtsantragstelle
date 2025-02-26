import { remixContext } from ".storybook/remixContext";
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
    name: "file upload",
    title: "Upload your files",
    formId: "formId",
    fileName: "testFile.pdf",
    fileSize: 1024,
    warningTitle: "Warning Title",
    deleteButtonLabel: "Delete",
    submitButtonLabel: "Upload Files",
    warningDescription: "Maximum files reached",
  },
  decorators: [(Story) => remixContext(Story)],
};
