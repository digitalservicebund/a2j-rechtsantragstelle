import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/KlageParteienUebersicht";
import { ProzessbevollmaechtigteUebersicht } from "./shared/klageParties/prozessbevollmaechtigte/components/ProzessbevollmaechtigteUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import SonstigeNebenUndProzessantraegeUebersicht from "./sonstigeNebenUndProzessantraege/components/SonstigeNebenUndProzessantraegeUebersicht";
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
        case "/sonstige-neben-und-prozessantraege/uebersicht":
          return <SonstigeNebenUndProzessantraegeUebersicht />;
        case "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/uebersicht":
          return <BezifferteZahlungsUndNebenantraegeUebersicht />;
        case "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/uebersicht":
          return <UnbezifferteSchmerzensgeldUebersicht />;
        case "/tatsachenvortrag-beweise/uebersicht":
          return <AntraegeUebersicht />;
        case "/tatsachenvortrag-beweise/hauptantrag/#/absaetze":
          return <AbsaetzeUebersicht />;
        case "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze":
          return <AbsaetzeUebersicht isNebenantrag={true} />;
      }
    },
    getDynamicOptions: function (): DynamicOptions | undefined {
      return undefined;
    },
  };

export const geldEinklagenAnwaltschaftLoaderExtras = {
  buildLoaderData: (context) => ({
    stepId: context.flowSessionEngine.stepId,
  }),
} satisfies LoaderExtras<GeldEinklagenAnwaltschaftLoaderExtraData>;
