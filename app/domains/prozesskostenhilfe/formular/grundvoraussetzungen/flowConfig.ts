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
      guard: (data) => isNachueberpruefung({ context: data }),
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
      guard: (data) =>
        isErstantrag({ context: data }) &&
        data.anhaengigesGerichtsverfahrenFrage === "yes",
      target: "klageersteller",
    },
    {
      target: "hinweis",
    },
  ],
  klageersteller: [
    {
      guard: (data) => verfahrenSelbststaendig({ context: data }),
      target: "hinweis",
    },
    {
      guard: (data) => grundvoraussetzungenDone({ context: data }),
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
      target: "empfaenger",
    },
  ],
  hinweisDigitalEinreichung: [
    {
      guard: (data) => grundvoraussetzungenDone({ context: data }),
      target: "empfaenger",
    },
  ],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
