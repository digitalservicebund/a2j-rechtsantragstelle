import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import {
  grundvoraussetzungenDone,
  isErstantrag,
  isNachueberpruefung,
  verfahrenSelbststaendig,
  versandDigitalGericht,
} from "./guards";
import { type prozesskostenhilfeFormularPages } from "../pages";

export const grundvoraussetzungenFlowConfig = {
  nachueberpruefungFrage: [
    {
      guard: (context) => isNachueberpruefung({ context }),
      target: "nameGericht",
    },
    {
      target: "anhaengigesGerichtsverfahrenFrage",
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
        isErstantrag({ context }) &&
        context.anhaengigesGerichtsverfahrenFrage === "yes",
      target: "klageersteller",
    },
    {
      target: "fall",
    },
  ],
  klageersteller: [
    {
      guard: (context) => verfahrenSelbststaendig({ context }),
      target: "hinweis",
    },
    {
      guard: (context) => grundvoraussetzungenDone({ context }),
      target: "empfaenger",
    },
  ],
  hinweis: [
    {
      target: "fall",
    },
  ],
  fall: [
    {
      guard: (context) => versandDigitalGericht({ context }),
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
      guard: (context) => grundvoraussetzungenDone({ context }),
      target: "empfaenger",
    },
  ],
  hinweisDigitalEinreichung: [
    {
      guard: (context) => grundvoraussetzungenDone({ context }),
      target: "empfaenger",
    },
  ],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
