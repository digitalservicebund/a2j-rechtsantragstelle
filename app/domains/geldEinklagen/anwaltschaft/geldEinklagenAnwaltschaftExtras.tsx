import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlageParteienUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import SonstigeNebenUndProzessantraegeUebersicht from "./sonstigeNebenUndProzessantraege/components/SonstigeNebenUndProzessantraegeUebersicht";
import ZahlungsAntragUebersicht from "./hauptUndNebenantraege/components/ZahlungsAntragUebersicht";

type GeldEinklagenAnwaltschaftLoaderExtraData = {
  stepId: string;
};

export const geldEinklagenAnwaltschaftExtras: FlowExtras<GeldEinklagenAnwaltschaftLoaderExtraData> =
  {
    renderExtraComponents: (loaderData) => {
      return (
        <>
          {loaderData.stepId === "/klagende-partei/klagenden/uebersicht" && (
            <KlageParteienUebersicht relationship="klagende" />
          )}
          {loaderData.stepId ===
            "/sonstige-neben-und-prozessantraege/uebersicht" && (
            <SonstigeNebenUndProzessantraegeUebersicht />
          )}
          {loaderData.stepId ===
            "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht" && (
            <ZahlungsAntragUebersicht />
          )}
        </>
      );
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
