import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

const erstAntragCase = [
  [
    {
      empfaenger: "otherPerson",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/zwei-formulare",
      "/finanzielle-angaben/einkuenfte/start",
    ],
  ],
  [
    {
      empfaenger: "myself",
      unterhaltsanspruch: "keine",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/unterhaltsanspruch",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "myself",
      unterhaltsanspruch: "unterhalt",
      livesPrimarilyFromUnterhalt: "no",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhalt",
      "/antragstellende-person/unterhalt-hauptsaechliches-leben",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "myself",
      unterhaltsanspruch: "unterhalt",
      livesPrimarilyFromUnterhalt: "yes",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhalt",
      "/antragstellende-person/unterhalt-hauptsaechliches-leben",
      "/antragstellende-person/unterhaltspflichtige-person",
      "/antragstellende-person/eigenes-exemplar",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "myself",
      unterhaltsanspruch: "anspruchNoUnterhalt",
      couldLiveFromUnterhalt: "no",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhalt-leben-frage",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "myself",
      unterhaltsanspruch: "anspruchNoUnterhalt",
      couldLiveFromUnterhalt: "yes",
    },
    [
      "/antragstellende-person/empfaenger",
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhalt-leben-frage",
      "/antragstellende-person/unterhaltspflichtige-person-beziehung",
      "/antragstellende-person/warum-keiner-unterhalt",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      unterhaltsanspruch: "sonstiges",
      unterhaltsbeschreibung: "Beschreibung",
    },
    [
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhaltsbeschreibung",
      "/rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      formularArt: "nachueberpruefung",
      unterhaltsanspruch: "sonstiges",
      unterhaltsbeschreibung: "Beschreibung",
    },
    [
      "/antragstellende-person/unterhaltsanspruch",
      "/antragstellende-person/unterhaltsbeschreibung",
      "/finanzielle-angaben/einkuenfte/start",
    ],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularUserData>;

const nachueberpruefungCase = erstAntragCase.map(([context, expectedPaths]) => [
  { ...context, formularArt: "nachueberpruefung" },
  [...expectedPaths.slice(0, -1), "/finanzielle-angaben/einkuenfte/start"],
]) satisfies TestCases<ProzesskostenhilfeFormularUserData>;

/**
 * Specifically test the "BACK" transitions pointing to antragstellende-person,
 * as there are two places they can happen: Rechtsschutzversicherung and Finanzielle Angaben
 * (in the case of a Nachueberpruefung)
 */
export const antragstellendePersonTransitionCases = [
  ...erstAntragCase,
  ...nachueberpruefungCase,
] satisfies TestCases<ProzesskostenhilfeFormularUserData>;
