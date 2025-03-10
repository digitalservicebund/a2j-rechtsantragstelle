import { /* GetObjectCommand, */ PutObjectCommand } from "@aws-sdk/client-s3";
import { FlowId } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";
import { sendSentryMessage } from "~/services/logging";
import { getSessionIdByFlowId } from "~/services/session.server";
// import { PDFFileMetadata } from "~/util/file/pdfFileSchema";

const USER_FILES_FOLDER = "user-files";
export const UNDEFINED_FILE_ERROR = "Attempted to upload undefined file";

const createFolderKey = (
  sessionId: string,
  flowId: FlowId,
  fileKey: string,
) => {
  return `${USER_FILES_FOLDER}${flowId}/${sessionId}/${fileKey}`;
};

export async function uploadUserFileToS3(
  cookieHeader: string | null,
  flowId: FlowId,
  file: File | undefined,
) {
  try {
    const s3Client = createClientS3DataStorage();
    if (!file) {
      throw new Error(UNDEFINED_FILE_ERROR);
    }
    const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
    const fileKey = crypto.randomUUID();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Body: new Uint8Array(await file.arrayBuffer()),
        Key: createFolderKey(sessionId, flowId, fileKey),
      }),
    );
    return fileKey;
  } catch (error) {
    const errorDescription =
      error instanceof Error ? error.message : "Unknown error";

    sendSentryMessage(
      `Error storing user uploaded file to S3 bucket: ${errorDescription}`,
      "error",
    );
  }
}

// export async function deleteUserFileFromS3(
//   _savedFileKey: PDFFileMetadata["savedFileKey"],
// ) {
//   try {
//     const s3Client = createClientS3DataStorage();
//     const file = await s3Client.send(
//       new GetObjectCommand({
//         Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
//         Body: new Uint8Array(await file.arrayBuffer()),
//         Key: createFolderKey(sessionId, flowId),
//       }),
//     );
//   } catch (error) {
//     const errorDescription =
//       error instanceof Error ? error.message : "Unknown error";

//     sendSentryMessage(
//       `Error storing user uploaded file to S3 bucket: ${errorDescription}`,
//       "error",
//     );
//   }
// }
