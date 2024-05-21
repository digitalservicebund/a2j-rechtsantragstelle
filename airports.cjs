const airportData = require("airport-data-js");
const fs = require("fs");
const _ = require("lodash");
const countriesTranslation = require("i18n-iso-countries");

const GERMAN_SPEAKING_COUNTRY = ["DE", "CH", "AT"];
const germanLocale = "de";

const patchData = {
  iata: "VII",
  country_code: "VN",
  country: "Vietnam",
  airport: "Vinh International Flughafen",
  latitude: "18.7376",
  longitude: "105.671",
  city: "Vinh",
  continent: "AS",
};

// This is a workaround for loading ESM package into CJS-based code
async function translator(text, targetLanguage) {
  const translate = (await import("translate")).default;
  return await translate(text, targetLanguage);
}

function translateAirportName(airportName) {
  // we cannot use .endWith() since the word airport is not always at the end
  // e.g  "San Rafael Airport (Argentina)"
  const airportIndex = airportName.toLowerCase().indexOf("airport");

  if (airportIndex !== -1) {
    return airportName.slice(0, airportIndex) + "Flughafen";
  } else {
    return airportName + " Flughafen";
  }
}

async function translateGermanSpeakingCity(airport) {
  if (GERMAN_SPEAKING_COUNTRY.includes(airport.country_code)) {
    try {
      return await translator(airport.city, germanLocale);
    } catch (error) {
      console.error("Translation error:", error.message);
    }
  } else {
    return airport.city;
  }
}

async function filteredLargeMediumAirports(airports) {
  const filteredAirports = [];

  for (const airport of airports) {
    const isLargeOrMediumAirport =
      airport.type === "large_airport" || airport.type === "medium_airport";
    const hasScheduledService = airport.scheduled_service === "TRUE";

    if (isLargeOrMediumAirport && hasScheduledService) {
      if (airport.iata === "VII") {
        filteredAirports.push(patchData);
      }
      filteredAirports.push({
        iata: airport.iata,
        country_code: airport.country_code,
        country:
          countriesTranslation.getName(airport.country_code, germanLocale) ??
          "",
        airport: translateAirportName(airport.airport),
        latitude: airport.latitude,
        longitude: airport.longitude,
        city: await translateGermanSpeakingCity(airport),
        continent: airport.continent || "NR",
      });
    }
  }

  return filteredAirports;
}

async function fetchAirportDataByContinent(continent) {
  const airports = await airportData.getAirportByContinent(continent);

  return filteredLargeMediumAirports(airports);
}

async function fetchAirportDataByCountry(country) {
  const airports = await airportData.getAirportByCountryCode(country);

  return filteredLargeMediumAirports(airports);
}

async function fetchAllAirports() {
  const southAmericaAirports = await fetchAirportDataByContinent("SA");
  const europaAirports = await fetchAirportDataByContinent("EU");
  const asiaAirports = await fetchAirportDataByContinent("AS");
  const africaAirports = await fetchAirportDataByContinent("AF");
  const oceaniaAirports = await fetchAirportDataByContinent("OC");
  const usAirports = await fetchAirportDataByCountry("US");
  const canadaAirports = await fetchAirportDataByCountry("CA");

  const airports = [];
  airports.push(...southAmericaAirports);
  airports.push(...europaAirports);
  airports.push(...asiaAirports);
  airports.push(...africaAirports);
  airports.push(...oceaniaAirports);
  airports.push(...usAirports);
  airports.push(...canadaAirports);

  return airports;
}

async function fetchAndSaveAirports() {
  const airports = await fetchAllAirports();
  const data = JSON.stringify(_.uniqBy(airports, "iata"));
  const filePath = "data/airports/data.json";

  fs.writeFile(filePath, data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log(`${filePath} written correctly`);
}

fetchAndSaveAirports();
