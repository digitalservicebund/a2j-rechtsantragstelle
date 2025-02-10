import type { Meta, StoryObj } from "@storybook/react";
import {
  FilesUpload,
  FilesUploadProps,
} from "~/components/filesUpload/FilesUpload";
import { FilesUploadState } from "~/services/filesUploadState/filesUploadState";

const defaultType: FilesUploadProps = {
  belegTitle: "Beleg Title",
  belegDescription: "Beleg Description",
  state: FilesUploadState.NotStarted,
  fileNames: [],
  fileSizes: [],
  cancelButtonLabel: "Cancel",
  deleteButtonLabel: "Delete",
  uploadProgressLabel: "loading...",
  selectFilesButtonLabel: "Select Files",
  selectMoreFilesButtonLabel: "Select More Files",
  errorMessage: "Error Message",
  warningTitle: "Warning Title",
  warningDescription: "Warning Description",
};

const meta = {
  title: "Component/FilesUpload",
  component: FilesUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FilesUploadNotStarted: Story = {
  args: {
    ...defaultType,
  },
};

export const FilesUploadWithErrorMessage: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.Error,
  },
};

export const FilesUploadInProgress: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.InProgress,
    fileNames: ["file1.pdf"],
  },
};

export const FilesUploadDone: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.Done,
    fileNames: ["file2.pdf"],
    fileSizes: [1024],
  },
};

export const FilesUploadDoneMultiple: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.Done,
    fileNames: ["file0.pdf", "file2.tiff", "file3.pdf", "file4.tiff"],
    fileSizes: [5000000, 1048576, 3145728, 5242880, 1048576],
  },
};

export const FilesUploadDoneLimit: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.Done,
    fileNames: [
      "file0.pdf",
      "file2.tiff",
      "file3.pdf",
      "file4.tiff",
      "file5.pdf",
    ],
    fileSizes: [5000000, 1048576, 3145728, 5242880, 1048576, 7340032],
  },
};

export const FilesUploadDoneWithLongFileName: Story = {
  args: {
    ...defaultType,
    state: FilesUploadState.Done,
    fileNames: ["fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee3.pdf"],
    fileSizes: [5242880],
  },
};
