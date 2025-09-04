/* oxlint-disable import/no-named-as-default-member */
/* oxlint-disable no-console */
import fs from "node:fs";
import countries from "i18n-iso-countries";
import uniqBy from "lodash/uniqBy";
import { type Airline } from "~/domains/fluggastrechte/services/airlines/types";

const GERMAN_LOCALE = "de";
const ENGLISH_LOCALE = "en";

function processAirlineRow(row: string): Airline {
  const [
    airlineName,
    arbitrationBoardCode,
    iataCode,
    region,
    countryFullName,
    ,
    streetAndNumber,
    city,
    postalCode,
  ] = row.split(";");
  const arbitrationBoardValueWithoutDash = arbitrationBoardCode.replace(
    "-",
    "",
  );
  const arbitrationBoardValue =
    arbitrationBoardValueWithoutDash.length === 0
      ? null
      : arbitrationBoardValueWithoutDash;

  const countryCode =
    countries.getAlpha2Code(countryFullName, ENGLISH_LOCALE) ?? "DE";

  return {
    name: airlineName,
    iata: iataCode,
    isInEU: region === "EU",
    arbitrationBoard: arbitrationBoardValue,
    streetAndNumber,
    postalCode: postalCode ? postalCode.replace(/[\r\n]/g, "") : "",
    city,
    country: countries.getName(countryCode, GERMAN_LOCALE) ?? "Deutschland",
  };
}

function saveAirlinesInFile(airlines: Airline[]): void {
  const data = JSON.stringify(uniqBy(airlines, "iata"));
  const saveFilePath = "data/airlines/data.json";

  fs.writeFile(saveFilePath, data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log(`${saveFilePath} written correctly`);
}

function isNonEmptyRow(row: string): boolean {
  return row.trim() !== "";
}

function generateAirlinesData(filePath: string) {
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });

  const rows = content.split("\n").filter(isNonEmptyRow);
  const airlines: Airline[] = [];
  rows.forEach((row) => {
    const airline = processAirlineRow(row);
    airlines.push(airline);
  });

  // For the use case that an airline is not part of the given airlines data, a `Sonstiges` (`Other`) airline is added to the list.
  airlines.push({
    name: "Sonstiges",
    iata: "sonstiges",
    isInEU: true, // set as true, so it goes to a different error page
    arbitrationBoard: null,
    streetAndNumber: "",
    postalCode: "",
    city: "",
    country: "",
  });

  saveAirlinesInFile(airlines);
}

generateAirlinesData(process.argv[2]);
