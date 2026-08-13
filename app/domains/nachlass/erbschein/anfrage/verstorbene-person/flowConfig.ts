import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type NachlassErbscheinAnfragePages } from "../pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const verstorbenePersonFlowConfig = {
  verstorbeneName: "sterbedatumOrt",
  sterbedatumOrt: "verstorbeneGeburtsdatumOrt",
  verstorbeneGeburtsdatumOrt: "verstorbeneFamilienstand",
  verstorbeneFamilienstand: "verstorbeneStaatsangehoerigkeit",
  verstorbeneStaatsangehoerigkeit: "verstorbeneZweiteStaatsangehoerigkeitFrage",
  verstorbeneZweiteStaatsangehoerigkeitFrage: [
    {
      guard: (data) => data.verstorbeneHadSecondNationality === "yes",
      target: "verstorbeneZweiteStaatsangehoerigkeit",
    },
    { target: "verstorbeneLebensmittelpunkt" },
  ],
  verstorbeneZweiteStaatsangehoerigkeit:
    "verstorbeneDritteStaatsangehoerigkeitFrage",
  verstorbeneDritteStaatsangehoerigkeitFrage: [
    {
      guard: (data) => data.verstorbeneHadThirdNationality === "yes",
      target: "verstorbeneDritteStaatsangehoerigkeit",
    },
    { target: "verstorbeneLebensmittelpunkt" },
  ],
  verstorbeneDritteStaatsangehoerigkeit: "verstorbeneLebensmittelpunkt",
  verstorbeneLebensmittelpunkt: [
    {
      guard: (data) => data.verstorbeneLebensmittelpunkt === "ausland",
      target: "auslaendischerErbfallInfo",
    },
    {
      target: "verstorbenePflegeheimFrage",
    },
  ],
  auslaendischerErbfallInfo: "verstorbenePersonAuslaendischeAdresse",
  verstorbenePflegeheimFrage: [
    {
      guard: (data) => data.verstorbeneLivedInPflegeheim === "yes",
      target: "verstorbenePflegeheimPlz",
    },
    { target: "verstorbeneHospizFrage" },
  ],
  verstorbenePflegeheimPlz: "verstorbenePersonAdresse",
  verstorbeneHospizFrage: [
    {
      guard: (data) => data.verstorbeneLivedInHospiz === "yes",
      target: "verstorbeneHospizPlz",
    },
    { target: "verstorbenePlz" },
  ],
  verstorbenePlz: "verstorbenePersonAdresse",
  verstorbeneHospizPlz: "verstorbenePersonAdresse",
  verstorbenePersonAdresse: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, [
          "verstorbenePersonStrasse",
          "verstorbenePersonHausnummer",
          "verstorbenePersonOrt",
        ]),
      target: "antragstellendePersonName",
    },
  ],
  verstorbenePersonAuslaendischeAdresse: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, [
          "verstorbenePersonAuslaendischeStrasse",
          "verstorbenePersonAuslaendischeHausnummer",
          "verstorbenePersonAuslaendischerOrt",
          "verstorbenePersonLand",
        ]),
      target: "antragstellendePersonName",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
