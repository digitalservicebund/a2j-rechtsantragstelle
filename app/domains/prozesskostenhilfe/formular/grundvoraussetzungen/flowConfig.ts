import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularGrundvoraussetzungenPages } from "./pages";
import { grundvoraussetzungenDone, versandDigitalGericht } from "./guards";

export const grundvoraussetzungenFlowConfig = {
  nachueberpruefungFrage: [
    {
      guard: (context) => context.formularArt === "nachueberpruefung",
      target: "nameGericht",
    },
  ],
  anhaengigesGerichtsverfahrenFrage: [
    {
      guard: (context) => context.anhaengigesGerichtsverfahrenFrage === "yes",
      target: "nameGericht",
    },
    { target: "klageersteller" },
  ],
  nameGericht: [
    {
      target: "aktenzeichen",
    },
  ],
  aktenzeichen: [
    {
      guard: (context) =>
        context.formularArt === "erstantrag" &&
        context.anhaengigesGerichtsverfahrenFrage === "yes",
      target: "klageersteller",
    },
    {
      target: "hinweis",
    },
  ],
  klageersteller: [
    {
      guard: (context) => context.verfahrenArt === "verfahrenSelbststaendig",
      target: "hinweis",
    },
    {
      guard: (data) => grundvoraussetzungenDone({ context: data }),
      target: null,
    },
  ],
  hinweis: [
    {
      target: "fall",
    },
  ],
  fall: [
    {
      guard: (data) => versandDigitalGericht({ context: data }),
      target: "mjp",
    },
    {
      target: "hinweisPapierEinreichung",
    },
  ],
  mjp: [
    {
      target: "hinweisDigitalEinreichung",
    },
  ],
  hinweisPapierEinreichung: [
    {
      guard: (data) => grundvoraussetzungenDone({ context: data }),
      target: null,
    },
  ],
  hinweisDigitalEinreichung: [
    {
      guard: (data) => grundvoraussetzungenDone({ context: data }),
      target: null,
    },
  ],
} satisfies Partial<
  TransitionConfigMap<typeof pkhFormularGrundvoraussetzungenPages>
>;
