// oxlint-disable no-console
import fs from "node:fs";
import path from "node:path";
import { parse } from "fast-csv";

type StreetData = {
  name: string;
  locality: string;
};

const INPUT_CSV_RELATIVE = "./streets.updated.csv";
const OUTPUT_JSON_RELATIVE = "../../data/streetNames.json";

const inputCsvPath = path.join(__dirname, INPUT_CSV_RELATIVE);
const outputJsonPath = path.join(__dirname, OUTPUT_JSON_RELATIVE);

export async function generateStreetNamesJson(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputCsvPath)) {
      return reject(new Error(`Input CSV not found at ${inputCsvPath}`));
    }

    const result: Record<string, StreetData[]> = {};
    const seenSignatures = new Set<string>();

    console.log("Parsing CSV and building grouped data...");
    console.time("Build Time");

    fs.createReadStream(inputCsvPath)
      .pipe(parse({ headers: true }))
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        const rawName = row.Name ?? "";
        const postalCode = (row.PostalCode ?? "").trim();
        const locality = (row.Locality ?? "").trim();

        if (!postalCode) return;

        const cleanName = rawName.replace(/(^"+|"+$)/g, "").trim();
        const uniqueSignature = `${postalCode}|${cleanName}|${locality}`;
        if (seenSignatures.has(uniqueSignature)) {
          return;
        }
        seenSignatures.add(uniqueSignature);

        if (!result[postalCode]) {
          result[postalCode] = [];
        }
        result[postalCode].push({ name: cleanName, locality });
      })
      .on("end", (rowCount: number) => {
        console.timeEnd("Build Time");
        console.log(`Parsed ${rowCount} rows.`);
        console.log(
          `Extracted ${Object.keys(result).length} unique postal codes.`,
        );

        console.log(`Writing JSON to ${OUTPUT_JSON_RELATIVE}...`);
        try {
          fs.writeFileSync(outputJsonPath, JSON.stringify(result));
          console.log("✅ JSON file successfully created!");
          resolve();
        } catch (writeError) {
          reject(writeError);
        }
      });
  });
}
