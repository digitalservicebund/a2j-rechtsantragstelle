import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/prozesskostenhilfeFormularData";
import type { TestCases } from "~/flows/__test__/TestCases";
import {
  prozesskostenhilfeFormular,
  type ProzesskostenhilfeFormularContext,
} from "~/flows/prozesskostenhilfeFormular";
import { antragstellendePersonTransitionCases } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/__test__/testcases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...prozesskostenhilfeFormular.config, context: {} },
  { guards: prozesskostenhilfeFormular.guards },
);

const cases = [
  [
    {
      formularArt: "erstantrag",
      verfahrenArt: "verfahrenSelbststaendig",
      versandArt: "digital",
    },
    [
      "grundvoraussetzungen/nachueberpruefung-frage",
      "grundvoraussetzungen/antrag/klageersteller",
      "grundvoraussetzungen/antrag/hinweis",
      "grundvoraussetzungen/einreichung/fall",
      "grundvoraussetzungen/einreichung/mjp",
      "grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
    ],
  ],
  [
    {
      empfaenger: "ich",
      unterhaltsanspruch: "anspruchNoUnterhalt",
      couldLiveFromUnterhalt: "yes",
      personWhoCouldPayUnterhaltBeziehung: "exEhepartner",
      whyNoUnterhalt: "",
    },
    [
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "antragstellende-person/unterhalt-leben-frage",
      "antragstellende-person/unterhaltspflichtige-person-beziehung",
      "antragstellende-person/warum-keiner-unterhalt",
    ],
  ],
  [
    { partnerschaft: "separated" },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "yes",
      partnerEinkommen: "yes",
      "partner-staatlicheLeistungen": "keine",
      "partner-currentlyEmployed": "yes",
      "partner-employmentType": "employed",
      "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
      "partner-arbeitsweg": "none",
      "partner-hasArbeitsausgaben": "no",
      "partner-receivesPension": "no",
      "partner-receivesSupport": "no",
      "partner-hasFurtherIncome": "no",
      partnerHasBesondersAusgaben: "no",
    },
    [
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
      "finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
      "finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  ...antragstellendePersonTransitionCases,
  [
    happyPathData,
    [
      "start/start",
      "grundvoraussetzungen/nachueberpruefung-frage",
      "grundvoraussetzungen/antrag/klageersteller",
      "grundvoraussetzungen/einreichung/fall",
      "grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
      "antragstellende-person/empfaenger",
      "antragstellende-person/unterhaltsanspruch",
      "rechtsschutzversicherung/rsv-frage",
      "rechtsschutzversicherung/org-frage",
      "finanzielle-angaben/einkuenfte/start",
      "finanzielle-angaben/einkuenfte/staatliche-leistungen",
      "finanzielle-angaben/einkuenfte/buergergeld",
      "finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      "finanzielle-angaben/einkuenfte/einkommen/art",
      "finanzielle-angaben/einkuenfte/einkommen/netto-einkommen",
      "finanzielle-angaben/einkuenfte/einkommen/selbststaendig",
      "finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
      "finanzielle-angaben/einkuenfte/abzuege/opnv-kosten",
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung",
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
      "finanzielle-angaben/einkuenfte/rente-frage",
      "finanzielle-angaben/einkuenfte/rente",
      "finanzielle-angaben/einkuenfte/leistungen/frage",
      "finanzielle-angaben/einkuenfte/leistungen/wohngeld",
      "finanzielle-angaben/einkuenfte/leistungen/krankengeld",
      "finanzielle-angaben/einkuenfte/leistungen/elterngeld",
      "finanzielle-angaben/einkuenfte/leistungen/kindergeld",
      "finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      "finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/kinder/kinder-frage",
      "finanzielle-angaben/kinder/uebersicht",
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/heirat-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "finanzielle-angaben/ausgaben/ausgaben-frage",
      "finanzielle-angaben/ausgaben/besondere-belastungen",
      "finanzielle-angaben/ausgaben-zusammenfassung/zusammenfassung",
      "gesetzliche-vertretung/frage",
      "gesetzliche-vertretung/daten",
      "persoenliche-daten/start",
      "persoenliche-daten/name",
      "persoenliche-daten/geburtsdatum",
      "persoenliche-daten/adresse",
      "persoenliche-daten/telefonnummer",
      "persoenliche-daten/beruf",
      "abgabe/ende",
    ],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularContext>;

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases,
};
