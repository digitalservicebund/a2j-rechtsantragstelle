import type {
  ExtraFlowLoaderData,
  FlowExtras,
} from "~/domains/extraLoaderConfiguration";
import BegruendungBeschreibungUebersicht from "./klage-erstellen/begruendung/components/BegruendungBeschreibungUebersicht";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";

type GeldEinklagenFormularLoaderExtraData = {
  stepId: string;
};

export const geldEinklageFormularExtras: FlowExtras<
  ExtraFlowLoaderData & GeldEinklagenFormularLoaderExtraData
> = {
  renderExtraComponents: (loaderData) => {
    return (
      <>
        {loaderData.stepId ===
          "/klage-erstellen/begruendung/beschreibung/uebersicht" && (
          <BegruendungBeschreibungUebersicht />
        )}
      </>
    );
  },
  getDynamicOptions: function (): DynamicOptions | undefined {
    return undefined;
  },
};

export const geldEinklageFormularLoaderExtras = {
  buildLoaderData: (context) => ({
    stepId: context.flowSessionEngine.stepId,
  }),
} satisfies LoaderExtras<GeldEinklagenFormularLoaderExtraData>;
