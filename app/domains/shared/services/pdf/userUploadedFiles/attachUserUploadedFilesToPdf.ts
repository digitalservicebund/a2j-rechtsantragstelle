import { PDFDocument } from "pdf-lib";
import { type FlowId } from "~/domains/flowIds";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

export type RelevantFiles = Array<
  [boolean | undefined, PDFFileMetadata[] | undefined]
>;

export async function attachUserUploadedFilesToPdf(
  mainPdfBuffer: Uint8Array,
  sessionId: string,
  flowId: FlowId,
  filesList: RelevantFiles,
): Promise<Uint8Array> {
  const pdfWithUserFiles = await PDFDocument.load(mainPdfBuffer);
  const relevantFiles = (
    await Promise.all(
      filesList
        .filter(([condition, files]) => condition && files && files.length > 0)
        .map(([, files]) =>
          Promise.all(
            files!
              .map((file) =>
                downloadUserFileFromS3(
                  sessionId,
                  flowId,
                  file.savedFileKey ?? "",
                ),
              )
              .flat(),
          ),
        ),
    )
  ).flat();

  for (const file of relevantFiles) {
    const userPdfFile = await PDFDocument.load(file);
    await appendPagesToPdf(pdfWithUserFiles, userPdfFile);
  }
  return pdfWithUserFiles.save();
}
