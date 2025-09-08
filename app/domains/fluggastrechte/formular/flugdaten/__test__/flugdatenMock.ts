import { type FluggastrechteFlugdatenUserData } from "../userData";

export const fluggesellschaftAddresse = {
  fluggesellschaft: "SU",
  fluggesellschaftAuswahlAdresse: "filledByUser",
  fluggesellschaftStrasseHausnummer: "Musterstr. 30",
  fluggesellschaftPostleitzahl: "10970",
  fluggesellschaftOrt: "Frankfurt",
  fluggesellschaftLand: "Deutschland",
} satisfies Partial<FluggastrechteFlugdatenUserData>;
