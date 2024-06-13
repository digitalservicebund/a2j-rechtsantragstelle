import fs from "node:fs";
import _ from "lodash";

interface Airline {
  name: string;
  iata: string;
  country: string;
  legalName: string;
}

function processAirlineRow(row: string): Airline {
  const columns = row.split(";");
  return {
    name: columns[0],
    iata: columns[2],
    country: columns[4],
    legalName: columns[5].replace("\r", ""),
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

  // We need this extra airline due the flow process when the airline is not in the list
  airlines.push({
    name: "Sonstiges",
    iata: "sonstiges",
    country: "",
    legalName: "Sonstiges",
  });

  saveAirlinesInFile(airlines);
}

void generateAirlinesData(process.argv[2]);
