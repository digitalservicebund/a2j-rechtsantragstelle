import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import { nachlassErbscheinWegweiserPages } from "./pages";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

const nachlassErbscheinWegweiserPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(nachlassErbscheinWegweiserPages);

export const nachlassErbscheinWegweiserFlowConfig = compileFlow({
  pages: nachlassErbscheinWegweiserPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "staatsangehoerigkeit",
    staatsangehoerigkeit: [
      {
        guard: (context) => context.staatsangehoerigkeit !== "german",
        target: "auslaendischerErbfall",
      },
      {
        target: "lebensmittelpunkt",
      },
    ],
    lebensmittelpunkt: [
      {
        guard: (context) => context.lebensmittelpunkt === "ausland",
        target: "auslaendischerErbfall",
      },
      {
        target: "testamentOderErbvertrag",
      },
    ],
    auslaendischerErbfall: null,
    testamentOderErbvertrag: [
      {
        guard: (context) => context.testamentType === "notarized",
        target: "notarizedTestament",
      },
      {
        guard: (context) => context.testamentType === "erbvertrag",
        target: "erbvertrag",
      },
      {
        target: "grundeigentum",
      },
    ],
    notarizedTestament: null,
    erbvertrag: null,
    grundeigentum: [
      {
        guard: (context) =>
          context.hasGrundeigentum === "yes" &&
          context.testamentType === "handwritten",
        target: "erbscheinRequiredHandwrittenTestament",
      },
      {
        guard: (context) =>
          context.hasGrundeigentum === "yes" &&
          context.testamentType === "none",
        target: "erbscheinRequiredNoTestament",
      },
      {
        target: "unternehmen",
      },
    ],
    erbscheinRequiredHandwrittenTestament: null,
    erbscheinRequiredNoTestament: null,
    unternehmen: [
      {
        guard: (context) =>
          context.hasUnternehmen === "yes" &&
          context.testamentType === "handwritten",

        target: "erbscheinRequiredHandwrittenTestament",
      },
      {
        guard: (context) =>
          context.hasUnternehmen === "yes" && context.testamentType === "none",
        target: "erbscheinRequiredNoTestament",
      },
      {
        target: "bankRequestedErbschein",
      },
    ],
    bankRequestedErbschein: [
      {
        guard: (context) => context.bankRequestedErbschein === "no",
        target: "erbscheinNotRequired",
      },
      {
        target: "erbscheinRequiredAndRequested",
      },
    ],
    erbscheinRequiredAndRequested: null,
    erbscheinNotRequired: null,
  },
}) as CompiledFlow<PageConfigMap>;
