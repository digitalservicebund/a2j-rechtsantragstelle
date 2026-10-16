import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import BegruendungBeschreibungUebersicht from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/BegruendungBeschreibungUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import HauptUndNebenantraegeUebersicht from "./hauptUndNebenantraege/components/HauptUndNebenantraegeUebersicht";

type GeldEinklagenAnwaltschaftLoaderExtraData = {
  stepId: string;
};

export const geldEinklagenAnwaltschaftExtras: FlowExtras<GeldEinklagenAnwaltschaftLoaderExtraData> =
  {
    renderExtraComponents: (loaderData) => {
      return (
        <>
          {loaderData.stepId === "/klagende-partei/klagende/uebersicht" && (
            <BegruendungBeschreibungUebersicht /> // TODO: replace w Anwaltschaft component
          )}
          {loaderData.stepId ===
            "/haupt-und-nebenantraege/sonstige-neben-und-prozessantraege/uebersicht" && (
            <HauptUndNebenantraegeUebersicht />
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
