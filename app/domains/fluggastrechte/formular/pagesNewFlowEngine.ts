import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { weiterePersonenArraySchema } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import { isTotalClaimWillSucceddedAboveLimit } from "~/domains/fluggastrechte/formular/services/isTotalClaimAboveLimit";
import { WEITERE_PERSONEN_START_INDEX } from "~/domains/fluggastrechte/formular/stringReplacements/person";
import { type FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { type PagesConfig } from "~/domains/pageSchemas";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";

const pagesWithLeadingSlash = addLeadingSlashToPageSchemas(
  fluggastrechteFormularPages,
);

export const fluggastrechteFormularPagesNewFlowEngine = {
  ...pagesWithLeadingSlash,
  // Format array in new flow config format
  // temporary, move into personal data page after migration
  weiterePersonenUebersicht: {
    ...pagesWithLeadingSlash.weiterePersonenUebersicht,
    arraySummary: {
      name: "weiterePersonen",
      schema: weiterePersonenArraySchema,
      isArrayRelevant: (context: FluggastrechteUserData) =>
        context.isWeiterePersonen === "yes",
      hiddenFields: ["anrede", "title", "datenverarbeitungZustimmung"],
      indexOffset: WEITERE_PERSONEN_START_INDEX,
      shouldDisableAddButton: isTotalClaimWillSucceddedAboveLimit,
    },
  },
  weiterePersonenDaten: {
    stepId: "/persoenliche-daten/weitere-personen/person/#/daten",
    pageSchema:
      fluggastrechteFormularPages.weiterePersonenDaten.arrayPages.daten
        .pageSchema,
  },
} satisfies PagesConfig;

export type FluggastrechteFormularPages =
  typeof fluggastrechteFormularPagesNewFlowEngine;
