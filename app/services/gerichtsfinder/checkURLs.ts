import fs from "node:fs";
import path from "node:path";
import { http, https } from "follow-redirects";
import pMap from "p-map";
import { getEncrypted } from "./encryptedStorage";
import type { GerbehFile } from "./convertJsonDataTable";
import { normalizeURL } from "../../util/strings";

const manualReplacements = {
  "www.amtsgericht-straubing.de":
    "https://www.justiz.bayern.de/gerichte-und-behoerden/amtsgerichte/straubing/",
};

const OUTFILE = path.resolve(
  path.join(
    process.cwd(),
    "app/services/gerichtsfinder/data/sanitizedURLs.json",
  ),
);
const concurrency = 50;

function allCourtURLs() {
  const gerbehDb: GerbehFile =
    getEncrypted()["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"];
  return Object.values(gerbehDb).map((court) => court?.URL1 ?? "");
}

function checkUrl(urlString: string) {
  // First follow https, then follow http
  return new Promise<[string, string]>((resolve) =>
    https
      .get(normalizeURL(urlString, "https"), (response) => {
        resolve([urlString, response.responseUrl]);
      })
      .on("error", () => {
        http
          .get(normalizeURL(urlString, "http"), (response) => {
            resolve([urlString, response.responseUrl]);
          })
          .on("error", () => resolve([urlString, ""]));
      }),
  );
}

async function checkAllURLS() {
  const urls = allCourtURLs();
  const uniqueURLs = Array.from(new Set(urls));
  console.log(`Checking a total of ${uniqueURLs.length} unique URLs...`);
  const checkedURLs = await pMap(uniqueURLs, checkUrl, { concurrency });
  const urlMap = Object.fromEntries(checkedURLs);
  for (const [url, correction] of Object.entries(manualReplacements)) {
    urlMap[url] = correction;
  }
  return urlMap;
}

async function writeURLMap() {
  const urlMap = await checkAllURLS();
  console.log(`Writing URL map to ${OUTFILE}...`);
  fs.writeFile(OUTFILE, JSON.stringify(urlMap), "utf8", () => {
    console.log("Task is finished.");
    process.exit();
  });
}

if (process.argv[2] === "checkURLs") writeURLMap();
