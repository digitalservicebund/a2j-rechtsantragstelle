import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/components/KlageParteienUebersicht";
import { ProzessbevollmaechtigteUebersicht } from "./shared/prozessbevollmaechtigte/components/ProzessbevollmaechtigteUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import SonstigeNebenUndProzessantraegeUebersicht from "./sonstigeNebenUndProzessantraege/components/SonstigeNebenUndProzessantraegeUebersicht";
import ZahlungsAntragUebersicht from "./hauptUndNebenantraege/components/ZahlungsAntragUebersicht";

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
        case "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht":
          return <ZahlungsAntragUebersicht />;
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
