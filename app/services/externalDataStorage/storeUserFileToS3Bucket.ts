import { PutObjectCommand } from "@aws-sdk/client-s3";
import { flowIdFromPathname } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";
import { sendSentryMessage } from "~/services/logging";
import { getSessionIdByFlowId } from "~/services/session.server";

const USER_FILES_FOLDER = "user-files";

const createFolderKey = (sessionId: string, flowId: string) => {
  return `${USER_FILES_FOLDER}/${flowId}/${sessionId}`;
};

async function convertToBuffer(file: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of file) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}

export async function uploadUserFileToS3(
  request: Request,
  file: AsyncIterable<Uint8Array>,
) {
  try {
    const s3Client = createClientS3DataStorage();
    const cookieHeader = request.headers.get("Cookie");
    const flowId = flowIdFromPathname(request.url);
    if (!flowId)
      throw new Error(`Attempted to upload user file outside of known flow`);
    const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);

    return await s3Client.send(
      new PutObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Body: await convertToBuffer(file),
        Key: createFolderKey(sessionId, flowId),
      }),
    );
  } catch (error) {
    const errorDescription =
      error instanceof Error ? error.message : "Unknown error";

    sendSentryMessage(
      `Error storing user uploaded file to S3 bucket: ${errorDescription}`,
      "error",
    );
  }
}
