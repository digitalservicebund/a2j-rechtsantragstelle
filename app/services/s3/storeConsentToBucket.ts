import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";
import { pdfDateFormat, today } from "~/util/date";
import { createClientDataConsentFgr } from "./createClientDataConsentFgr";

export const storeConsentToBucket = async () => {
  const s3Client = createClientDataConsentFgr();

  const buffer = Buffer.from("test;test;test", "utf8");
  const key = `${pdfDateFormat(today())}/any-name`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config().AWS_S3_DATA_CONSENT_FGR_BUCKET_NAME,
      Body: buffer,
      Key: key,
    }),
  );
};
