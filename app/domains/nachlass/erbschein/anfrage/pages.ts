import { antragstellendePersonPages } from "~/domains/nachlass/erbschein/anfrage/antragstellende-person/pages";
import { testamentOderErbvertragPages } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/pages";
import { verstorbenePersonPages } from "~/domains/nachlass/erbschein/anfrage/verstorbene-person/pages";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";

export const nachlassErbscheinAnfragePages = {
  start: {
    stepId: "/start",
  },
  datenverarbeitung: {
    stepId: "/start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  ...verstorbenePersonPages,
  ...antragstellendePersonPages,
  ...testamentOderErbvertragPages,
} satisfies PagesConfig;

export type NachlassErbscheinAnfragePages =
  typeof nachlassErbscheinAnfragePages;
