import airlines from "data/airlines/data.json";

export function getAirlineByIataCode(iataCode?: string) {
  if (!iataCode) return undefined;
  return airlines.find(
    (airline: { iata: string }) => airline.iata === iataCode,
  );
}
