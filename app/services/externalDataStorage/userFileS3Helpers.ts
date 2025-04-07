import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { type FlowId } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";
import { sendSentryMessage } from "~/services/logging";
import { getSessionIdByFlowId } from "~/services/session.server";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

const USER_FILES_FOLDER = "user-files";
export const UNDEFINED_FILE_ERROR = "Attempted to upload undefined file";

const getObjectKey = (sessionId: string, flowId: FlowId, fileKey: string) => {
  return `${USER_FILES_FOLDER}${flowId}/${sessionId}/${fileKey}`;
};

export async function uploadUserFileToS3(
  cookieHeader: string | null,
  flowId: FlowId,
  fileArrayBuffer: ArrayBuffer | undefined,
) {
  try {
    const s3Client = createClientS3DataStorage();
    if (!fileArrayBuffer) {
      throw new Error(UNDEFINED_FILE_ERROR);
    }
    const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
    const fileKey = crypto.randomUUID();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Body: new Uint8Array(fileArrayBuffer),
        Key: getObjectKey(sessionId, flowId, fileKey),
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
    throw error;
  }
}

export async function deleteUserFileFromS3(
  cookieHeader: string | null,
  flowId: FlowId,
  savedFileKey: NonNullable<PDFFileMetadata["savedFileKey"]>,
) {
  try {
    const s3Client = createClientS3DataStorage();
    const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Key: getObjectKey(sessionId, flowId, savedFileKey),
      }),
    );
  } catch (error) {
    const errorDescription =
      error instanceof Error ? error.message : "Unknown error";

    sendSentryMessage(
      `Error storing user uploaded file to S3 bucket: ${errorDescription}`,
      "error",
    );
    throw error;
  }
}
