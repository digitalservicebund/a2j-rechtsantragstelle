import fs from "node:fs";
import { downloadFromS3 } from "./downloadS3";
import { convertToKvJson } from "./convertJsonDataTable";
import dotenv from "dotenv";
dotenv.config();

const OBS_BUCKET_NAME = process.env.OBS_BUCKET_NAME;
const OBS_KEY = process.env.OBS_KEY;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (
  !OBS_BUCKET_NAME ||
  !OBS_KEY ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY
) {
  console.error(
    "Ensure all environment variables (OBS_BUCKET_NAME, OBS_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are set."
  );
  process.exit(1);
}

downloadFromS3(
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
    console.log(err);
  }
);
