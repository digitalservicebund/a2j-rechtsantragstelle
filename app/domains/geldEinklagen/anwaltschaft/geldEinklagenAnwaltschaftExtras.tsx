import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/KlageParteienUebersicht";
import { ProzessbevollmaechtigteUebersicht } from "./shared/klageParties/prozessbevollmaechtigte/components/ProzessbevollmaechtigteUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { getAntraegeStrings } from "./stringReplacements";
import { type GeldEinklagenAnwaltschaftUserData } from "./userData";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import SonstigeAntraegeUebersicht from "./sonstigeAntraege/components/SonstigeAntraegeUebersicht";
import { AntraegeUebersicht } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/AntraegeUebersicht";
import { AbsaetzeUebersicht } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/components/AbsaetzeUebersicht";
import BezifferteZahlungsUndNebenantraegeUebersicht from "./hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/BezifferteZahlungsUndNebenantraegeUebersicht";
import UnbezifferteSchmerzensgeldUebersicht from "./hauptUndNebenantraege/unbezifferteSchmerzensgeldUndNebenantraege/UnbezifferteSchmerzensgeldUebersicht";

type GeldEinklagenAnwaltschaftLoaderExtraData = {
  stepId: string;
};

export const geldEinklagenAnwaltschaftExtras: FlowExtras<GeldEinklagenAnwaltschaftLoaderExtraData> =
  {
    renderExtraComponents: ({ stepId }) => {
      switch (stepId) {
        case "/klagende-partei/klagenden/uebersicht":
          return <KlageParteienUebersicht relationship="klagende" />;
        case "/beklagte-partei/beklagten/uebersicht":
          return <KlageParteienUebersicht relationship="beklagte" />;
        case "/klagende-partei/prozessbevollmaechtigte/uebersicht":
          return <ProzessbevollmaechtigteUebersicht relationship="klagende" />;
        case "/beklagte-partei/prozessbevollmaechtigte/uebersicht":
          return <ProzessbevollmaechtigteUebersicht relationship="beklagte" />;
        case "/sonstige-antraege/uebersicht":
          return <SonstigeAntraegeUebersicht />;
        case "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/uebersicht":
          return <BezifferteZahlungsUndNebenantraegeUebersicht />;
        case "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/uebersicht":
          return <UnbezifferteSchmerzensgeldUebersicht />;
        case "/tatsachenvortrag-beweise/uebersicht":
          return <AntraegeUebersicht />;
        case "/tatsachenvortrag-beweise/vortraege/#/absaetze":
          return <AbsaetzeUebersicht />;
      }
    },
    getDynamicOptions: function (): DynamicOptions | undefined {
      return undefined;
    },
  };

export const geldEinklagenAnwaltschaftLoaderExtras = {
  buildReplacements: ({ flowSessionEngine, arrayIndexes }) =>
    getAntraegeStrings(
      flowSessionEngine.prunedUserData as GeldEinklagenAnwaltschaftUserData,
      flowSessionEngine.stepId,
      arrayIndexes,
    ),
  buildLoaderData: (context) => ({
    stepId: context.flowSessionEngine.stepId,
  }),
} satisfies LoaderExtras<GeldEinklagenAnwaltschaftLoaderExtraData>;
