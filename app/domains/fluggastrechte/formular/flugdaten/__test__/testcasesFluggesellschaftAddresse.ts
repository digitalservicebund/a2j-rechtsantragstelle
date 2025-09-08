import { type TestCases } from "~/domains/__test__/TestCases";
import { type FluggastrechteUserData } from "../../userData";

export const testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse =
  [
    [
      {
        fluggesellschaftAuswahlAdresse: "filledByUser",
        fluggesellschaftStrasseHausnummer: "Musterstr. 30",
        fluggesellschaftPostleitzahl: "10970",
        fluggesellschaftOrt: "Frankfurt",
        fluggesellschaftLand: "Deutschland",
      },
      [
        "/flugdaten/adresse-fluggesellschaft-auswahl",
        "/flugdaten/adresse-fluggesellschaft",
        "/flugdaten/geplanter-flug",
      ],
    ],
    [
      {
        fluggesellschaftAuswahlAdresse: "fromAirlineDB",
      },
      [
        "/flugdaten/adresse-fluggesellschaft-auswahl",
        "/flugdaten/geplanter-flug",
      ],
    ],
  ] as const satisfies TestCases<FluggastrechteUserData>;
