import fs from "node:fs";
import path from "node:path";
import { downloadFromS3 } from "./downloadS3";
import {
  applyDataConversions,
  extractJsonFilesFromZip,
  writeJsonFiles,
} from "./convertJsonDataTable";
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

function handleZipFile(zipFilepath: string) {
  const jsonObjects = extractJsonFilesFromZip(zipFilepath);
  const convertedData = applyDataConversions(jsonObjects);
  const outFolder = path.resolve(path.join(__dirname, "_data"));
  console.log(`Conversion successful, writing to ${outFolder}`);
  writeJsonFiles(convertedData, outFolder);
  fs.unlinkSync(zipFilepath);
}

downloadFromS3(
  AWS_HOST_URL,
  OBS_BUCKET_NAME,
  OBS_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
).then(
  (outputFilepath) => handleZipFile(outputFilepath),
  (err) => console.error(err)
);
