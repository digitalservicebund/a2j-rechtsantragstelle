import airlines from "data/airlines/data.json";

export function getAirlineByIataCode(iataCode?: string) {
  if (typeof iataCode === "undefined" || iataCode.length === 0) {
    return undefined;
  }
  return airlines.find(
    (airline: { iata: string }) => airline.iata === iataCode,
  );
}
