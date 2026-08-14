import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbausschlagungAnfragePages } from "../pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const verstorbenePersonFlowConfig = {
  verstorbeneName: "verstorbeneGeburtsdatum",
  verstorbeneGeburtsdatum: "verstorbeneSterbedatum",
  verstorbeneSterbedatum: "verstorbeneLebensmittelpunkt",
  verstorbeneLebensmittelpunkt: [
    {
      guard: (data) => data.verstorbeneLebensmittelpunkt === "ausland",
      target: "verstorbeneAuslaendischeAdresse",
    },
    {
      target: "pflegeheim",
    },
  ],
  pflegeheim: [
    {
      guard: (data) => data.livedInNursingHome === "yes",
      target: "pflegeheimPLZ",
    },
    {
      guard: (data) => data.livedInNursingHome === "no",
      target: "hospiz",
    },
  ],
  hospiz: [
    {
      guard: (data) => data.livedInHospice === "yes",
      target: "plzBeforeHospiz",
    },
    {
      guard: (data) => data.livedInHospice === "no",
      target: "verstorbenePlz",
    },
  ],
  plzBeforeHospiz: [
    {
      guard: (data) => data.plzBeforeHospiz !== undefined,
      target: "verstorbeneAdresse",
    },
  ],
  pflegeheimPLZ: [
    {
      guard: (data) => data.plzPflegeheim !== undefined,
      target: "verstorbeneAdresse",
    },
  ],
  verstorbenePlz: [
    {
      guard: (data) => data.plzVerstorbene !== undefined,
      target: "verstorbeneAdresse",
    },
  ],
  verstorbeneAdresse: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, [
          "verstorbeneAdresseStrasse",
          "verstorbeneAdresseHausnummer",
          "verstorbeneAdresseOrt",
        ]),
      target: "awarenessDate",
    },
  ],
  verstorbeneAuslaendischeAdresse: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, [
          "verstorbeneAuslaendischeAdresseStrasse",
          "verstorbeneAuslaendischeAdresseHausnummer",
          "verstorbeneAuslaendischeAdressePLZ",
          "verstorbeneAuslaendischeAdresseOrt",
          "verstorbeneAuslaendischeAdresseLand",
        ]),
      target: "awarenessDate",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbausschlagungAnfragePages>>;
