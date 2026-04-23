/* oxlint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { type IncomingMessage } from "node:http";
import { type FollowResponse } from "follow-redirects";
import followRedirects from "follow-redirects";
import pMap from "p-map";
import type { GerbehFile } from "~/services/gerichtsfinder/convertJsonDataTable";
import { getEncrypted } from "~/services/gerichtsfinder/encryptedStorage.server";
import { normalizeURL } from "~/util/strings";

const { http, https } = followRedirects; // Workaround, as follow-redirects is not ESM ready

const manualReplacements: Record<string, string> = {
  "www.amtsgericht-straubing.de":
    "https://www.justiz.bayern.de/gerichte-und-behoerden/amtsgerichte/straubing/",
  "www.saarland.de/amtsgericht_saarlouis.htm":
    "https://www.saarland.de/agsls/DE/home/home_node.html",
  "www.justiz.bayern.de/gericht/ag-aoe":
    "https://www.justiz.bayern.de/gerichte-und-behoerden/amtsgerichte/altoetting/",
  "https://ordentliche-gerichtsbarkeit.hessen.de/AG-Koenigstein":
    "https://ordentliche-gerichtsbarkeit.hessen.de/landgerichtsbezirk-frankfurt-am-main/amtsgericht-koenigstein-im-taunus",
};

const OUTFILE = path.resolve(
  path.join(process.cwd(), "data/courts/sanitizedURLs.json"),
);
const concurrency = 50;

function allCourtURLs() {
  const gerbehDb: GerbehFile =
    getEncrypted()["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"];
  return Object.values(gerbehDb)
    .filter((court) => court?.URL1 || court?.URL2)
    .map((court) => court?.URL1 ?? court?.URL2 ?? "");
}

function warnIfNot200(
  intialUrl: string,
  response: IncomingMessage & FollowResponse,
) {
  if (response.statusCode && response.statusCode !== 200)
    console.warn(
      `Warning: ${intialUrl} was forwarded to ${response.responseUrl} with statuscode ${response.statusCode}`,
    );
}

function checkUrl(urlString: string) {
  //  1. try manual replacement or https, 2. try http, 3. try strip www. subdomain (for example www.ag-badliebenwerda.brandenburg.de)
  return new Promise<[string, string]>((resolve) =>
    https
      .get(
        manualReplacements[urlString] ?? normalizeURL(urlString, "https"),
        (response) => {
          warnIfNot200(urlString, response);
          resolve([urlString, response.responseUrl]);
        },
      )
      .on("error", () => {
        http
          .get(normalizeURL(urlString, "http"), (response) => {
            warnIfNot200(urlString, response);
            resolve([urlString, response.responseUrl]);
          })
          .on("error", () => {
            https
              .get(
                normalizeURL(urlString.replace("www.", ""), "https"),
                (response) => {
                  warnIfNot200(urlString, response);
                  resolve([urlString, response.responseUrl]);
                },
              )
              .on("error", () => {
                if (urlString)
                  console.error(`No valid redirect found for ${urlString}`);
                resolve([urlString, ""]);
              });
          });
      }),
  );
}

async function checkAllURLS() {
  const urls = allCourtURLs();
  const uniqueURLs = Array.from(new Set(urls));
  console.log(`Checking a total of ${uniqueURLs.length} unique URLs...`);
  return Object.fromEntries(await pMap(uniqueURLs, checkUrl, { concurrency }));
}

export default async function writeURLMap() {
  const urlMap = await checkAllURLS();
  console.log(`Writing URL map to ${OUTFILE}...`);
  fs.writeFileSync(OUTFILE, JSON.stringify(urlMap), "utf8");
}
