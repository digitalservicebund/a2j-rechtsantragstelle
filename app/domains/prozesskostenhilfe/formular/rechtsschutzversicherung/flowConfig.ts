import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularRechtsschutzversicherungPages } from "./pages";

export const rechtsschutzversicherungFlowConfig = {
  rsvFrage: [
    {
      guard: (context) => context.hasRsv === "yes",
      target: "rsvDeckung",
    },
    { target: "orgFrage" },
  ],
  rsvDeckung: [
    {
      guard: (context) => context.hasRsvCoverage === "yes",
      target: "rsvDeckungJa",
    },
    {
      guard: (context) => context.hasRsvCoverage === "partly",
      target: "rsvDeckungTeilweise",
    },
    {
      guard: (context) => context.hasRsvCoverage === "no",
      target: "rsvDeckungNein",
    },
    {
      guard: (context) => context.hasRsvCoverage === "unknown",
      target: "rsvDeckungUnbekannt",
    },
  ],
  rsvDeckungJa: null,
  rsvDeckungUnbekannt: null,
  rsvDeckungNein: [{ target: "orgFrage" }],
  rsvDeckungTeilweise: [{ target: "orgFrage" }],
  orgFrage: [
    {
      guard: (context) => context.hasRsvThroughOrg === "yes",
      target: "orgDeckung",
    },
  ],
  orgDeckung: [
    {
      guard: (context) => context.hasOrgCoverage === "yes",
      target: "orgDeckungJa",
    },
    {
      guard: (context) => context.hasOrgCoverage === "partly",
      target: "orgDeckungTeilweise",
    },
    {
      guard: (context) => context.hasOrgCoverage === "no",
      target: "orgDeckungNein",
    },
    {
      guard: (context) => context.hasOrgCoverage === "unknown",
      target: "orgDeckungUnbekannt",
    },
  ],
  orgDeckungJa: null,
  orgDeckungUnbekannt: null,
  orgDeckungNein: null,
  orgDeckungTeilweise: null,
} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularRechtsschutzversicherungPages>
>;
