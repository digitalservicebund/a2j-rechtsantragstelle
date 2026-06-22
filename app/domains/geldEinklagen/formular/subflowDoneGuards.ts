import { type PageData } from "~/services/flow/pageDataSchema";

const isSubflowDone =
  (sectionPath: string) =>
  (context: { pageData?: PageData }): boolean =>
    context.pageData?.subflowDoneStates?.[sectionPath] === true;

export const isSachgebietDone = isSubflowDone("/gericht-pruefen/sachgebiet");
export const isKlagendePersonDone = isSubflowDone(
  "/gericht-pruefen/klagende-person",
);
export const isBeklagtePersonDone = isSubflowDone(
  "/gericht-pruefen/beklagte-person",
);
export const isGerichtSuchenDone = isSubflowDone(
  "/gericht-pruefen/gericht-suchen",
);
export const isKlageErstellenBeklagtePersonDone = isSubflowDone(
  "/klage-erstellen/beklagte-person",
);
export const isProzessfuehrungDone = isSubflowDone(
  "/klage-erstellen/prozessfuehrung",
);
