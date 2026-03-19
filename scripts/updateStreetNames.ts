import { syncStreetNamesFile } from "./streetNames/update";
import { buildStreetNamesDb } from "./streetNames/postProcess";

export default async function updateStreetNames() {
  const localFilePath = await syncStreetNamesFile();
  buildStreetNamesDb(localFilePath);
}
