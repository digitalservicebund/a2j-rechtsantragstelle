import { S3Client } from "@aws-sdk/client-s3";
import { config } from "~/services/env/env.server";

let instance: S3Client | undefined = undefined;

export const createClientS3DataStorage = () => {
  if (instance) return instance;

  const { S3_DATA_STORAGE_ACCESS_KEY, S3_DATA_STORAGE_SECRET_KEY } = config();
  if (S3_DATA_STORAGE_ACCESS_KEY && S3_DATA_STORAGE_SECRET_KEY) {
    instance = new S3Client({
      region: config().S3_REGION,
      credentials: {
        accessKeyId: S3_DATA_STORAGE_ACCESS_KEY,
        secretAccessKey: S3_DATA_STORAGE_SECRET_KEY,
      },
      endpoint: config().S3_ENDPOINT,
    });
  }
  return instance;
};

export const resetS3Client = () => (instance = undefined);
