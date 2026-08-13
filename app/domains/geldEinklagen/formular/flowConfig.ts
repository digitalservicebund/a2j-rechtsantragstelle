import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { geldEinklagenFormularPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { gerichtPruefenIntroFlowConfig } from "./gericht-pruefen/intro/flowConfig";
import { gerichtPruefenSachgebietFlowConfig } from "./gericht-pruefen/sachgebiet/flowConfig";
import { gerichtPruefenKlagendePersonFlowConfig } from "./gericht-pruefen/klagendePerson/flowConfig";
import { gerichtPruefenBeklagtePersonFlowConfig } from "./gericht-pruefen/beklagtePerson/flowConfig";
import { gerichtPruefenGerichtSuchenFlowConfig } from "./gericht-pruefen/gericht-suchen/flowConfig";
import { zustaendigesGerichtDone } from "./gericht-pruefen/zustaendiges-gericht/doneFunctions";
import { hasFilledKlagendePerson } from "./klage-erstellen/klagende-person/xStateConfig";
import { klageErstellenProzessfuehrungFlowConfig } from "./klage-erstellen/prozessfuehrung/flowConfig";
import { hasOptionalString } from "~/domains/guards.server";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenFormularUserData } from "./userData";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";

const geldEinklagenFormularPagesWithLeadingSlash = addLeadingSlashToPageSchemas(
  geldEinklagenFormularPages,
);

const isBeklagtePersonDone = (context: GeldEinklagenFormularUserData) => {
  return (
    context.pageData?.subflowDoneStates?.[
      "/klage-erstellen/beklagte-person"
    ] === true
  );
};

export const geldEinklagenFlowConfig = compileFlow({
  pages: geldEinklagenFormularPagesWithLeadingSlash,
  initialStep: "introAnwaltschaft",
  transitions: {
    ...gerichtPruefenIntroFlowConfig,
    forderungWas: [
      {
        guard: (context) => context.forderung === "etwasAnderes",
        target: "forderungErrorEtwasAnderes",
      },
      {
        target: "sachgebietInfo",
        guard: (context) => objectKeysNonEmpty(context, ["forderung"]),
      },
    ],
    forderungErrorEtwasAnderes: null,
    ...gerichtPruefenSachgebietFlowConfig,
    ...gerichtPruefenKlagendePersonFlowConfig,
    ...gerichtPruefenBeklagtePersonFlowConfig,
    ...gerichtPruefenGerichtSuchenFlowConfig,
    zustaendigesGerichtPilotGerichtAuswahl: "zustaendigesGerichtPilotGericht",
    zustaendigesGerichtPilotGericht: [
      {
        guard: (context) => zustaendigesGerichtDone({ context }),
        target: "klageErstellenIntroStart",
      },
    ],
    zustaendigesGerichtGerichtAbbruch: null,
    klageErstellenIntroStart: "streitWertKostenGerichtskostenvorschuss",
    streitWertKostenGerichtskostenvorschuss: "streitwertKostenWeitereKosten",
    streitwertKostenWeitereKosten: [
      {
        guard: (context) => context.anwaltschaft === "yes",
        target: "klagendePersonAnwaltschaft",
      },
      {
        target: "klagendePersonKontaktdaten",
      },
    ],
    klagendePersonAnwaltschaft: "klagendePersonKontaktdaten",
    klagendePersonKontaktdaten: [
      {
        guard: (context) =>
          context.gegenWenBeklagen === "person" &&
          hasFilledKlagendePerson({ context }),
        target: "beklagtePersonMenschen",
      },
      {
        guard: (context) => hasFilledKlagendePerson({ context }),
        target: "beklagtePersonOrganisation",
      },
    ],
    beklagtePersonMenschen: [
      {
        guard: (context) => isBeklagtePersonDone(context),
        target: "forderungGesamtbetrag",
      },
    ],
    beklagtePersonOrganisation: [
      {
        guard: (context) => isBeklagtePersonDone(context),
        target: "forderungGesamtbetrag",
      },
    ],
    forderungGesamtbetrag: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["forderungGesamtbetrag"]),
        target: "sachverhaltBegruendung",
      },
    ],
    sachverhaltBegruendung: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["sachverhaltBegruendung"]),
        target: "beweiseAngebot",
      },
    ],
    beweiseAngebot: [
      {
        guard: (context) => context.beweiseAngebot === "yes",
        target: "beweiseBeschreibung",
      },
      {
        guard: (context) => context.beweiseAngebot === "no",
        target: "prozessfuehrungAnwaltskosten",
      },
    ],
    beweiseBeschreibung: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["beweiseBeschreibung"]),
        target: "prozessfuehrungAnwaltskosten",
      },
    ],
    ...klageErstellenProzessfuehrungFlowConfig,
    rechtlicherZusatzWeitereAntraege: "rechtlicherZusatzRechtlicheWuerdigung",
    rechtlicherZusatzRechtlicheWuerdigung: [
      {
        guard: (context) =>
          hasOptionalString(context.weitereAntraege) &&
          hasOptionalString(context.rechtlicheWuerdigung),
        target: "zusammenfassungUebersicht",
      },
    ],
    zusammenfassungUebersicht: [
      {
        guard: (context) => context.anwaltschaft === "yes",
        target: "klageHerunterladenIntroStartAnwaltschaft",
      },
      {
        target: "klageHerunterladenIntroStart",
      },
    ],
    klageHerunterladenIntroStartAnwaltschaft: null,
    klageHerunterladenIntroStart: null,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
