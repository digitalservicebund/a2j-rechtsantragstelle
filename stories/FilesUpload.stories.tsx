import { faker } from "@faker-js/faker";
import { ActionFunctionArgs } from "react-router";
import type { Meta, StoryObj } from "@storybook/react";
import FilesUpload from "~/components/filesUpload/FilesUpload";
import { splitFieldName } from "~/services/upload/fileUploadHelpers";
import { TranslationContext } from "~/services/translations/translationsContext";
import { PDFFileMetadata, TEN_MB_IN_BYTES } from "~/util/file/pdfFileSchema";
import { RFCFormerProvider } from ".storybook/RFCFormerProvider";
import { reactRouterContext } from ".storybook/reactRouterContext";

const meta = {
  title: "Component/FilesUpload",
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

let mockUploadedFiles: Array<PDFFileMetadata> = [];

export const Default: Story = {
  args: {
    name: fieldName,
    title: "Upload your files",
  },
  decorators: [
    (Story) => (
      <TranslationContext.Provider
        value={{
          fileUpload: {
            delete: "Löschen",
            select: "Datei Auswählen",
            addAnother: "Weitere Datei Auswählen",
          },
          feedback: {},
          video: {},
          accessibility: {},
          accordion: {},
        }}
      >
        {reactRouterContext(
          () => (
            <RFCFormerProvider>
              <Story />
            </RFCFormerProvider>
          ),
          () => ({ csrf: "csrf" }),
          async ({ request }: ActionFunctionArgs) => {
            const formData = await request.formData();
            const formAction = formData.get("_action");
            if (
              typeof formAction === "string" &&
              formAction.startsWith("deleteFile")
            ) {
              const { inputIndex } = splitFieldName(formAction.split(".")[1]);
              mockUploadedFiles = mockUploadedFiles.filter(
                (_, index) => index !== inputIndex,
              );
            } else {
              mockUploadedFiles.push(generateRandomPDFFileMetadata());
            }
            return {
              [fieldName]: mockUploadedFiles,
            };
          },
        )}
      </TranslationContext.Provider>
    ),
  ],
};
