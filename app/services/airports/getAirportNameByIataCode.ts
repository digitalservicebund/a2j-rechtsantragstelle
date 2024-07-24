import airports from "data/airports/data.json";

export function getAirportNameByIataCode(airportIataCode: string): string {
  if (airportIataCode.length > 0) {
    const airport = airports.find((aiport) => aiport.iata === airportIataCode);

    if (airport) {
      return airport.airport.includes(airport.city)
        ? `${airport.airport} (${airport.iata})`
        : `${airport.city} ${airport.airport} (${airport.iata})`;
    }
  }

  return "";
}
