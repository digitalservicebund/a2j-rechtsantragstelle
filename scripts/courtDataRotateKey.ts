import { env } from "process";
import {
  getEncrypted,
  COURT_DATA_FILEPATH,
} from "~/services/gerichtsfinder/encryptedStorage.server";
import { saveEncrypted } from "./courtDataUpdate";
import { configDotenv } from "dotenv";

export default function rotateKey() {
  // Re-encrypt the file using GERICHTSFINDER_ENCRYPTION_KEY. This only changes the file if it has been encrypted with GERICHTSFINDER_ENCRYPTION_KEY_OLD
  configDotenv();
  const newKey = env.GERICHTSFINDER_ENCRYPTION_KEY;
  if (!newKey) throw new Error("Error: no new key provided, aborting...");
  saveEncrypted(getEncrypted(), COURT_DATA_FILEPATH, newKey);
}
