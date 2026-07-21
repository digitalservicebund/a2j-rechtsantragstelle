import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const ehepartnerFlowConfig = {
  spouseName: [
    {
      guard: (data) => data.verstorbeneFamilienstand === "verwitwet",
      target: "spouseSterbedatumOrt",
    },
    {
      guard: (data) => data.verstorbeneFamilienstand === "geschieden",
      target: "angehoerigeOverview",
    },
    {
      target: "spouseHasDifferentAddress",
    },
  ],
  spouseHasDifferentAddress: [
    {
      guard: (data) => data.spouseHasDifferentAddress === "yes",
      target: "ehepartnerAnschrift",
    },
    {
      target: "ehepartnerStaatsangehoerigkeit",
    },
  ],
  ehepartnerAnschrift: "ehepartnerStaatsangehoerigkeit",
  ehepartnerStaatsangehoerigkeit: "ehepartnerZweiteStaatsangehoerigkeitFrage",
  ehepartnerZweiteStaatsangehoerigkeitFrage: [
    {
      guard: (data) => data.ehepartnerHadSecondNationality === "yes",
      target: "ehepartnerZweiteStaatsangehoerigkeit",
    },
    {
      target: "ehevertrag",
    },
  ],
  ehepartnerZweiteStaatsangehoerigkeit: "ehevertrag",
  ehevertrag: [
    {
      guard: (data) => data.hasEhevertrag !== undefined,
      target: "angehoerigeOverview",
    },
  ],
  spouseSterbedatumOrt: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, ["spouseSterbedatum", "spouseSterbeort"]),
      target: "angehoerigeOverview",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
