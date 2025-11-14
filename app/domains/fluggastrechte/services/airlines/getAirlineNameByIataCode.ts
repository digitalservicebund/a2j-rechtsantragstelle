import airlines from "data/airlines/data.json";

export function getAirlineNameByIataCode(iataCode?: string) {
  if (!iataCode) return "";
  const airline = airlines.find((airline) => airline.iata === iataCode);

  return airline?.name ?? "";
}
