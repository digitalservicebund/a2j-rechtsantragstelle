import { S3Client } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";

let instance: S3Client | undefined = undefined;

export const createClientS3DataStorage = () => {
  if (typeof instance === "undefined") {
    const credentials = {
      accessKeyId: config().S3_DATA_STORAGE_ACCESS_KEY,
      secretAccessKey: config().S3_DATA_STORAGE_SECRET_KEY,
    };

    instance = new S3Client({
      region: config().S3_REGION,
      credentials,
      endpoint: config().S3_ENDPOINT,
    });
  }

  return instance;
};
