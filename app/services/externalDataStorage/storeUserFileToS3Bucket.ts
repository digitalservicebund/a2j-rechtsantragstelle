import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FlowId, flowIdFromPathname } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { createClientS3DataStorage } from "~/services/externalDataStorage/createClientS3DataStorage";
import { sendSentryMessage } from "~/services/logging";
import { getSessionIdByFlowId } from "~/services/session.server";

const USER_FILES_FOLDER = "user-files";

const createFolderKey = (sessionId: string, flowId: FlowId) => {
  return `${USER_FILES_FOLDER}${flowId}/${sessionId}/${crypto.randomUUID()}`;
};

export async function uploadUserFileToS3(
  cookieHeader: string | null,
  url: string,
  file?: File,
) {
  try {
    const s3Client = createClientS3DataStorage();
    const flowId = flowIdFromPathname(new URL(url).pathname);
    if (!flowId)
      throw new Error(`Attempted to upload user file outside of known flow`);
    if (!file) {
      throw new Error(`Attempted to upload undefined file`);
    }
    const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);

    return await s3Client.send(
      new PutObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
        Body: new Uint8Array(await file.arrayBuffer()),
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
