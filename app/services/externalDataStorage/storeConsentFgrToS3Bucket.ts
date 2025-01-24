import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";
import { today, toGermanDateFormat } from "~/util/date";
import { createClientDataConsentFgr } from "./createClientDataConsentFgr";
import { sendSentryMessage } from "../logging";
import { getSessionIdByFlowId } from "../session.server";

const createConsentDataBuffer = (sessionId: string, headers: Headers) => {
  const userAgent = headers.get("user-agent");
  return Buffer.from(`${sessionId};${Date.now()};${userAgent}`, "utf8");
};

const getFolderDate = () => {
  return toGermanDateFormat(today()).replaceAll(".", "-");
};

export const storeConsentFgrToS3Bucket = async ({ headers }: Request) => {
  try {
    const s3Client = createClientDataConsentFgr();
    const cookieHeader = headers.get("Cookie");
    const sessionId = await getSessionIdByFlowId(
      "/fluggastrechte/formular",
      cookieHeader,
    );

    const buffer = createConsentDataBuffer(sessionId, headers);
    const key = `${getFolderDate()}/${sessionId}.csv`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config().AWS_S3_DATA_CONSENT_FGR_BUCKET_NAME,
        Body: buffer,
        Key: key,
      }),
    );
  } catch (error) {
    const errorDescription =
      error instanceof Error ? error.message : "Unknown error";

    sendSentryMessage(
      `Error storing consent fgr data to S3 bucket: ${errorDescription}`,
      "error",
    );
  }
};
