import type { FlowExtras } from "~/domains/extraLoaderConfiguration";
import { KlageParteienUebersicht } from "~/domains/geldEinklagen/anwaltschaft/shared/components/KlageParteienUebersicht";
import { type LoaderExtras } from "~/services/flow/server/loaderExtras";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import SonstigeNebenUndProzessantraegeUebersicht from "./sonstigeNebenUndProzessantraege/components/SonstigeNebenUndProzessantraegeUebersicht";

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
        case "/sonstige-neben-und-prozessantraege/uebersicht":
          return <SonstigeNebenUndProzessantraegeUebersicht />;
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
