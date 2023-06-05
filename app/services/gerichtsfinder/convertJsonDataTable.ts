// Call using npm run update:gerichtsfinder -- ./link/to/file.zip
import fs from "node:fs";
import path from "node:path";
import { unzipSync, strFromU8 } from "fflate";

import type {
  TypInfo,
  Jmtd14VTErwerberGerbeh,
  Jmtd14VTErwerberPlzstrn,
  Jmtd14VTErwerberPlzortk,
} from "./types";
import { printFileReadError } from "~/lib/strings";

export type GerbehFile = Record<string, Jmtd14VTErwerberGerbeh>;
export type PlzOrtkFile = Record<string, Jmtd14VTErwerberPlzortk[]>;
export type PlzStrnFile = Record<string, Jmtd14VTErwerberPlzstrn[]>;

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}

export function normalizeFilepath(filepath: string) {
  return path.isAbsolute(filepath)
    ? path.resolve(filepath)
    : path.resolve(path.join(process.cwd(), filepath));
}

export interface GerbehIndex {
  LKZ: string;
  OLG: string;
  LG: string;
  AG: string;
  typInfo: TypInfo;
}

export function gerbehIndex(info: GerbehIndex) {
  const typInfo = info.typInfo.replace(/ /g, "").toLowerCase();
  return `${info.LKZ}_${info.OLG}_${info.LG}_${info.AG}_${typInfo}`;
}
interface ConversionInput {
  [key: string]: any[];
}

export const conversions = {
  "JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json": (object: ConversionInput) => {
    return Object.fromEntries(
      (object.JMTD14_VT_ERWERBER_GERBEH as Jmtd14VTErwerberGerbeh[])
        .filter((entry) => entry.TYP_INFO == "Zivilgericht - Amtsgericht")
        .map((entry) => [
          gerbehIndex({
            LKZ: entry.LKZ,
            OLG: entry.OLG,
            LG: entry.LG,
            AG: entry.AG,
            typInfo: entry.TYP_INFO,
          }),
          entry,
        ])
    );
  },

  "JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json": (object: ConversionInput) => {
    let out: PlzOrtkFile = {};
    const plzOrtkData: Jmtd14VTErwerberPlzortk[] =
      object.JMTD14_VT_ERWERBER_PLZORTK;

    plzOrtkData.forEach((entry) => {
      if (entry.ANGELEGENHEIT_INFO === "Prozesskostenhilfe eingehend") {
        if (entry.PLZ in out) {
          out[entry.PLZ].push(entry);
        } else {
          out[entry.PLZ] = [entry];
        }
      }
    });
    return out;
  },

  "JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json": (object: ConversionInput) => {
    let out: PlzStrnFile = {};
    const plzStrnData: Jmtd14VTErwerberPlzstrn[] =
      object.JMTD14_VT_ERWERBER_PLZSTRN;

    plzStrnData.forEach((entry) => {
      if (entry.ANGELEGENHEIT_INFO === "Prozesskostenhilfe eingehend") {
        if (entry.PLZ in out) {
          out[entry.PLZ].push(entry);
        } else {
          out[entry.PLZ] = [entry];
        }
      }
    });
    return out;
  },
} as const;

export function convertToKvJson(pathToZipFile: string) {
  const DATA_ROOT_DIR = normalizeFilepath(pathToZipFile);
  const OUT_FOLDER = path.resolve(path.join(__dirname, "_data"));
  console.log(`Trying to read from ${DATA_ROOT_DIR}`);

  try {
    // Only decompresses .json files into { filename: U8Array, ... }
    const decompressedJsonFiles = unzipSync(fs.readFileSync(DATA_ROOT_DIR), {
      filter: (file) => file.name.endsWith(".json"),
    });

    console.log(`Unzip successful, writing data to ${OUT_FOLDER}`);
    fs.mkdirSync(OUT_FOLDER, { recursive: true });

    for (const jsonFilepath in decompressedJsonFiles) {
      const jsonFilename = path.basename(jsonFilepath);
      console.log(`processing ${jsonFilename}`);

      if (isKeyOfObject(jsonFilename, conversions)) {
        // Decompressed data needs to be converted into string before calling conversion function
        const contentString = strFromU8(decompressedJsonFiles[jsonFilepath]);
        const outString = JSON.stringify(
          conversions[jsonFilename](JSON.parse(contentString))
        );
        const outFilepath = path.join(OUT_FOLDER, jsonFilename);
        fs.writeFileSync(outFilepath, outString, { encoding: "utf8" });
      } else {
        console.log("Not found in conversions, skipping...");
      }
    }
  } catch (err) {
    printFileReadError(err);
    process.exit(1);
  }
}
