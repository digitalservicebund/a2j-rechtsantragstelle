import { angehoerigePages } from "~/domains/nachlass/erbschein/anfrage/angehoerige/pages";
import { antragstellendePersonPages } from "~/domains/nachlass/erbschein/anfrage/antragstellende-person/pages";
import { ehepartnerPages } from "~/domains/nachlass/erbschein/anfrage/ehepartner/pages";
import { nachlassPages } from "~/domains/nachlass/erbschein/anfrage/nachlass/pages";
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
  ...ehepartnerPages,
  ...angehoerigePages,
  ...nachlassPages,
} satisfies PagesConfig;

export type NachlassErbscheinAnfragePages =
  typeof nachlassErbscheinAnfragePages;
