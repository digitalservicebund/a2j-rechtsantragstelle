import { PutObjectCommand } from "@aws-sdk/client-s3";
import { parsePathname } from "~/domains/flowIds";
import { config } from "~/services/env/env.server";
import { today, toGermanDateFormat } from "~/util/date";
import { createClientS3DataStorage } from "./createClientS3DataStorage";
import { sendSentryMessage } from "../logging";
import { getSessionIdByFlowId } from "../session.server";

const DATA_CONSENT_FGR_FOLDER = "data-consent-fgr";

const createConsentDataBuffer = (sessionId: string, headers: Headers) => {
  const userAgent = headers.get("user-agent");
  const date = new Date();
  return Buffer.from(`${sessionId};${date.toISOString()};${userAgent}`, "utf8");
};

const getFolderDate = () => {
  return toGermanDateFormat(today()).replaceAll(".", "-");
};

const createFolderKey = (sessionId: string, identifier: string) => {
  return `${DATA_CONSENT_FGR_FOLDER}/${getFolderDate()}/${sessionId}-${identifier}.csv`;
};

const uploadConsentDataToS3 = async (headers: Headers, identifier: string) => {
  try {
    const s3Client = createClientS3DataStorage();
    const cookieHeader = headers.get("Cookie");
    const sessionId = await getSessionIdByFlowId(
      "/fluggastrechte/formular",
      cookieHeader,
    );

    const buffer = createConsentDataBuffer(sessionId, headers);
    const key = createFolderKey(sessionId, identifier);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config().S3_DATA_STORAGE_BUCKET_NAME,
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

export const storeMultiplePersonsConsent = async ({
  headers,
  url,
}: Request) => {
  const { pathname } = new URL(url);
  const { arrayIndexes } = parsePathname(pathname);
  const additionalPersonIndex = arrayIndexes?.at(0);

  if (additionalPersonIndex === undefined) {
    throw new Error("Consent(Error): Array index is missing or undefined");
  }

  await uploadConsentDataToS3(headers, additionalPersonIndex.toString());
};

export const storeMainPersonConsent = async ({ headers }: Request) => {
  await uploadConsentDataToS3(headers, "main");
};
