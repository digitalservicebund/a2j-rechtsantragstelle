import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const rsvCoverageSchema = z.enum(
  ["yes", "no", "partly", "unknown"],
  customRequiredErrorMessage,
);

export const pkhFormularRechtsschutzversicherungPages = {
  rsvFrage: {
    stepId: "rechtsschutzversicherung/rsv-frage",
    pageSchema: {
      hasRsv: YesNoAnswer,
    },
  },
  rsvDeckung: {
    stepId: "rechtsschutzversicherung/rsv-deckung",
    pageSchema: {
      hasRsvCoverage: rsvCoverageSchema,
    },
  },
  rsvDeckungJa: {
    stepId: "rechtsschutzversicherung/rsv-deckung-ja",
  },
  rsvDeckungUnbekannt: {
    stepId: "rechtsschutzversicherung/rsv-deckung-unbekannt",
  },
  rsvDeckungNein: {
    stepId: "rechtsschutzversicherung/rsv-deckung-nein",
  },
  rsvDeckungTeilweise: {
    stepId: "rechtsschutzversicherung/rsv-deckung-teilweise",
  },
  orgFrage: {
    stepId: "rechtsschutzversicherung/org-frage",
    pageSchema: {
      hasRsvThroughOrg: YesNoAnswer,
    },
  },
  orgDeckung: {
    stepId: "rechtsschutzversicherung/org-deckung",
    pageSchema: {
      hasOrgCoverage: rsvCoverageSchema,
    },
  },
  orgDeckungJa: {
    stepId: "rechtsschutzversicherung/org-deckung-ja",
  },
  orgDeckungUnbekannt: {
    stepId: "rechtsschutzversicherung/org-deckung-unbekannt",
  },
  orgDeckungNein: {
    stepId: "rechtsschutzversicherung/org-deckung-nein",
  },
  orgDeckungTeilweise: {
    stepId: "rechtsschutzversicherung/org-deckung-teilweise",
  },
} as const satisfies PagesConfig;
