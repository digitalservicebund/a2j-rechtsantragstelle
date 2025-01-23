import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";
import { today } from "~/util/date";
import { createClientDataConsentFgr } from "./createClientDataConsentFgr";
import { getSessionIdByFlowId } from "../session.server";

const createConsentDataBuffer = (sessionId: string, request: Request) => {
  const userAgent = request.headers.get("user-agent");
  return Buffer.from(`${sessionId};${Date.now()};${userAgent}`, "utf8");
};

const getFolderDate = () => {
  return today()
    .toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll(".", "-");
};

export const storeConsentToBucket = async (request: Request) => {
  const s3Client = createClientDataConsentFgr();
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = await getSessionIdByFlowId(
    "/fluggastrechte/formular",
    cookieHeader,
  );

  const buffer = createConsentDataBuffer(sessionId, request);
  const key = `${getFolderDate()}/${sessionId}.csv`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config().AWS_S3_DATA_CONSENT_FGR_BUCKET_NAME,
      Body: buffer,
      Key: key,
    }),
  );
};
