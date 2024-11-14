import airlines from "data/airlines/data.json";

export const isFluggesellschaftInEU = (fluggesellschaft?: string) => {
  const isAirlineInEU =
    airlines.find((airline) => airline.iata === fluggesellschaft)?.isInEU ??
    false;

  return isAirlineInEU;
};
