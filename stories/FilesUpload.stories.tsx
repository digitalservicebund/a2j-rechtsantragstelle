import { faker } from "@faker-js/faker";
import { type ActionFunctionArgs } from "react-router";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FilesUpload from "~/components/formElements/filesUpload/FilesUpload";
import {
  type PDFFileMetadata,
  TEN_MB_IN_BYTES,
} from "~/services/validation/pdfFileSchema";
import { reactRouterFormContext } from ".storybook/reactRouterFormContext";
import { splitFieldName } from "~/services/upload/splitFieldName";

const meta = {
  title: "FormElements/FilesUpload",
  component: FilesUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FilesUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

const fieldName = "belege";

const generateRandomPDFFileMetadata = (): PDFFileMetadata => {
  return {
    filename:
      faker.system.fileName().split(".")[0] +
      "." +
      faker.system.fileExt("application/pdf"),
    fileType: "application/pdf",
    fileSize: faker.number.int({ min: 1024, max: TEN_MB_IN_BYTES }),
  };
};

let mockUploadedFiles: PDFFileMetadata[] = [];

export const Default: Story = {
  args: {
    name: fieldName,
    title: "Upload your files",
  },
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <Story />,
        undefined, // schema
        () => ({ csrf: "csrf" }),
        async ({ request }: ActionFunctionArgs) => {
          const formData = await request.formData();
          const formAction = formData.get("_action") as string;
          const [action, inputName] = formAction.split(".");

          if (action === "deleteFile") {
            const { inputIndex } = splitFieldName(inputName);
            mockUploadedFiles = mockUploadedFiles.filter(
              (_, index) => index !== inputIndex,
            );
          } else {
            mockUploadedFiles.push(generateRandomPDFFileMetadata());
          }
          return { [fieldName]: mockUploadedFiles };
        },
      ),
  ],
};
