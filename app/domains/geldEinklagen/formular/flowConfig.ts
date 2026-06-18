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

const geldEinklagenFormularPagesWithLeadingSlash = Object.fromEntries(
  Object.entries(geldEinklagenFormularPages).map(([key, pageConfig]) => [
    key,
    {
      ...pageConfig,
      stepId: pageConfig.stepId.startsWith("/")
        ? pageConfig.stepId
        : `/${pageConfig.stepId}`,
    },
  ]),
) as {
  [K in keyof typeof geldEinklagenFormularPages]: Omit<
    (typeof geldEinklagenFormularPages)[K],
    "stepId"
  > & {
    stepId: string;
  };
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
    beklagtePersonMenschen: "forderungGesamtbetrag",
    beklagtePersonOrganisation: "forderungGesamtbetrag",
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
}) as CompiledFlow<PageConfigMap>;
