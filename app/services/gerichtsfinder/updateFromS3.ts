import fs from "node:fs";
import { downloadFromS3 } from "./downloadS3";
import { convertToKvJson } from "./convertJsonDataTable";
import dotenv from "dotenv";
dotenv.config();

const OBS_BUCKET_NAME = process.env.OBS_BUCKET_NAME;
const OBS_KEY = process.env.OBS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_HOST_URL = process.env.AWS_HOST_URL;

if (
  !OBS_BUCKET_NAME ||
  !OBS_KEY ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_HOST_URL
) {
  console.error(
    "Ensure all environment variables (OBS_BUCKET_NAME, OBS_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_HOST_URL) are set."
  );
  process.exit(1);
}

downloadFromS3(
  AWS_HOST_URL,
  OBS_BUCKET_NAME,
  OBS_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
).then(
  (outputFilepath) => {
    convertToKvJson(outputFilepath);
    fs.unlinkSync(outputFilepath);
  },
  (err) => {
    console.error(err);
  }
);
