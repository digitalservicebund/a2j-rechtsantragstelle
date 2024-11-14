import airlines from "data/airlines/data.json";

export function getAirlineNameByIataCode(iataCode?: string) {
  if (typeof iataCode === "undefined" || iataCode.length === 0) {
    return "";
  }
  const airline = airlines.find((airline) => airline.iata === iataCode);

  return airline?.name ?? "";
}
