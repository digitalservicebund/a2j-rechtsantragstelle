/* eslint-disable no-console */
import fs from "node:fs";
import _ from "lodash";

interface Airline {
  name: string;
  iata: string;
  isInEU: boolean;
  arbitrationBoard: string;
}

function processAirlineRow(row: string): Airline {
  const [airlineName, arbitrationBoard, iataCode, region] = row.split(";");
  return {
    name: airlineName,
    iata: iataCode,
    isInEU: region === "EU",
    arbitrationBoard,
  };
}

function saveAirlinesInFile(airlines: Airline[]): void {
  const data = JSON.stringify(_.uniqBy(airlines, "iata"));
  const saveFilePath = "data/airlines/data.json";

  fs.writeFile(saveFilePath, data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log(`${saveFilePath} written correctly`);
}

async function generateAirlinesData(filePath: string) {
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });

  const rows = content.split("\n");
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
    arbitrationBoard: "",
  });

  saveAirlinesInFile(airlines);
}

generateAirlinesData(process.argv[2]);
