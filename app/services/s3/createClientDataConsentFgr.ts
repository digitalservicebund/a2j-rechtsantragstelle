import { S3Client } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";

let instance: S3Client | undefined = undefined;

export const createClientDataConsentFgr = () => {
  if (typeof instance === "undefined") {
    const credentials = {
      accessKeyId: config().AWS_S3_DATA_CONSENT_FGR_ACCESS_KEY,
      secretAccessKey: config().AWS_S3_DATA_CONSENT_FGR_SECRET_KEY,
    };

    instance = new S3Client({
      region: config().AWS_S3_REGION,
      credentials,
      endpoint: config().AWS_S3_ENDPOINT,
    });
  }

  return instance;
};
