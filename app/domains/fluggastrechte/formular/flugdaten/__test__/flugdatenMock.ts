import { type FluggastrechteUserData } from "../../userData";

export const fluggesellschaftAddresse = {
  fluggesellschaft: "SU",
  fluggesellschaftAuswahlAdresse: "filledByUser",
  fluggesellschaftStrasse: "Musterstr.",
  fluggesellschaftHausnummer: "30",
  fluggesellschaftPostleitzahl: "10970",
  fluggesellschaftOrt: "Frankfurt",
  fluggesellschaftLand: "Deutschland",
} satisfies Partial<FluggastrechteUserData>;
