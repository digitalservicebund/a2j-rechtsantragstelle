import { Readable } from "stream";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { type FlowId } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";
import { sendSentryMessage } from "~/services/logging";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

const USER_FILES_FOLDER = "user-files";

const getObjectKey = (sessionId: string, flowId: FlowId, fileKey: string) => {
  return `${USER_FILES_FOLDER}${flowId}/${sessionId}/${fileKey}`;
};

export async function uploadUserFileToS3(
  sessionId: string,
  flowId: FlowId,
  fileArrayBuffer: ArrayBuffer,
) {
  try {
    const s3Client = createClientS3DataStorage();
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
    sendSentryMessage("Error storing user uploaded file to S3 bucket", "error");
    throw error;
  }
}

export async function deleteUserFileFromS3(
  sessionId: string,
  flowId: FlowId,
  savedFileKey: NonNullable<PDFFileMetadata["savedFileKey"]>,
) {
  try {
    const s3Client = createClientS3DataStorage();
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Key: getObjectKey(sessionId, flowId, savedFileKey),
      }),
    );
  } catch (error) {
    sendSentryMessage("Error storing user uploaded file to S3 bucket", "error");
    throw error;
  }
}
export async function downloadUserFileFromS3(
  sessionId: string,
  flowId: FlowId,
  savedFileKey: NonNullable<PDFFileMetadata["savedFileKey"]>,
) {
  try {
    const s3Client = createClientS3DataStorage();
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Key: getObjectKey(sessionId, flowId, savedFileKey),
      }),
    );
    if (!response.Body) {
      throw new Error("Response body is undefined");
    }
    if (response.Body instanceof Readable) {
      return await streamToBuffer(response.Body);
    }
    if (response.Body instanceof Blob) {
      return await response.Body.arrayBuffer().then((buffer) => {
        return Buffer.from(buffer);
      });
    }
    throw new Error("Response body is not a readable stream");
  } catch (error) {
    sendSentryMessage(
      "Error downloading user uploaded file from S3 bucket",
      "error",
    );
    throw error;
  }
}

async function streamToBuffer(stream: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    stream.on("error", (error) => {
      reject(error);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
