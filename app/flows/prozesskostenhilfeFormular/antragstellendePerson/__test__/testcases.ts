import type { TestCases } from "~/flows/__test__/TestCases";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";

const erstAntragCase = [
  [
    {
      empfaenger: "anderePerson",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/zwei-formulare",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "keine",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "unterhalt",
      livesPrimarilyFromUnterhalt: "no",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "antragstellende-person/unterhalt",
      "antragstellende-person/unterhalt-hauptsaechliches-leben",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "unterhalt",
      livesPrimarilyFromUnterhalt: "yes",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "antragstellende-person/unterhalt",
      "antragstellende-person/unterhalt-hauptsaechliches-leben",
      "antragstellende-person/unterhaltspflichtige-person",
      "antragstellende-person/eigenes-exemplar",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "anspruchNoUnterhalt",
      couldLiveFromUnterhalt: "no",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "antragstellende-person/unterhalt-leben-frage",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "anspruchNoUnterhalt",
      couldLiveFromUnterhalt: "yes",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "antragstellende-person/unterhalt-leben-frage",
      "antragstellende-person/unterhaltspflichtige-person-beziehung",
      "antragstellende-person/warum-keiner-unterhalt",
      "rechtsschutzversicherung/rsv-frage",
    ],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularContext>;

const nachueberpruefungCase = erstAntragCase.map(([context, expectedPaths]) => [
  { ...context, formularArt: "nachueberpruefung" },
  [...expectedPaths.slice(0, -1), "finanzielle-angaben/einkuenfte/start"],
]) satisfies TestCases<ProzesskostenhilfeFormularContext>;

/**
 * Specifically test the "BACK" transitions pointing to antragstellende-person,
 * as there are two places they can happen: Rechtsschutzversicherung and Finanzielle Angaben
 * (in the case of a Nachueberpruefung)
 */
export const antragstellendePersonTransitionCases = [
  ...erstAntragCase,
  ...nachueberpruefungCase,
] satisfies TestCases<ProzesskostenhilfeFormularContext>;
