/* eslint-disable no-console */
import fs from "node:fs";
import uniqBy from "lodash/uniqBy";

type Airline = {
  name: string;
  iata: string;
  isInEU: boolean;
  arbitrationBoard: string | null;
};

function processAirlineRow(row: string): Airline {
  const [airlineName, arbitrationBoardCode, iataCode, region] = row.split(";");
  const arbitrationBoardValueWithoutDash = arbitrationBoardCode.replace(
    "-",
    "",
  );
  const arbitrationBoardValue =
    arbitrationBoardValueWithoutDash.length === 0
      ? null
      : arbitrationBoardValueWithoutDash;
  return {
    name: airlineName,
    iata: iataCode,
    isInEU: region === "EU",
    arbitrationBoard: arbitrationBoardValue,
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
  });

  saveAirlinesInFile(airlines);
}

generateAirlinesData(process.argv[2]);
