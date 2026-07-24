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
      guard: (data) =>
        data.verstorbeneFamilienstand === "geschieden" &&
        data.testamentArt === "none",
      target: "angehoerigeOverview",
    },
    {
      guard: (data) => data.verstorbeneFamilienstand === "geschieden",
      target: "grundbesitz",
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
      guard: (data) =>
        data.hasEhevertrag !== undefined && data.testamentArt === "none",
      target: "angehoerigeOverview",
    },
    {
      guard: (data) => data.hasEhevertrag !== undefined,
      target: "grundbesitz",
    },
  ],
  spouseSterbedatumOrt: [
    {
      guard: (data) =>
        objectKeysNonEmpty(data, ["spouseSterbedatum", "spouseSterbeort"]) &&
        data.testamentArt === "none",
      target: "angehoerigeOverview",
    },
    {
      guard: (data) =>
        objectKeysNonEmpty(data, ["spouseSterbedatum", "spouseSterbeort"]),
      target: "grundbesitz",
    },
  ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
