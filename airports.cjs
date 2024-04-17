const airportData = require("airport-data-js");
const fs = require("fs");
const _ = require("lodash");
const countriesTranslation = require("i18n-iso-countries");

function filteredLargeMediumAirports(airports) {
  return airports
    .filter(
      (airport) =>
        (airport.type === "large_airport" ||
          airport.type === "medium_airport") &&
        airport.scheduled_service === "TRUE",
    )
    .map((airport) => {
      return {
        iata: airport.iata,
        country_code: airport.country_code,
        country: countriesTranslation.getName(airport.country_code, "de") ?? "",
        airport: airport.airport,
        latitude: airport.latitude,
        longitude: airport.longitude,
        city: airport.city,
        continent: airport.continent || "NR",
      };
    });
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

  fs.writeFile("data/airports/data.json", data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }

    console.log("data/airports/data.json written correctly");
  });
}

fetchAndSaveAirports();
