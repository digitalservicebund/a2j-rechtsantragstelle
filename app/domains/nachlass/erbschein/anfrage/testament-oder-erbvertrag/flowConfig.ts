import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { beguenstigtenArray } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { firstArrayIndex } from "~/services/flow/pageData";

export const testamentOderErbvertragFlowConfig = {
  testamentArt: [
    {
      guard: (data) =>
        data.testamentArt === "none" &&
        (data.verstorbeneFamilienstand === "verheiratet" ||
          data.verstorbeneFamilienstand === "verwitwet" ||
          data.verstorbeneFamilienstand === "geschieden"),
      target: "spouseName",
    },
    {
      guard: (data) =>
        data.testamentArt === "none" &&
        data.verstorbeneFamilienstand === "ledig",
      target: "hatteKinder",
    },
    {
      target: "namedBeneficiariesOverview",
    },
  ],
  namedBeneficiariesOverview: [
    { type: "addArrayItem", target: "namedBeneficiaryName" },
    {
      guard: (data) =>
        !beguenstigtenArray.safeParse(data.beguenstigten).success,
      target: "namedBeneficiariesWarning",
    },
    {
      guard: (data) =>
        (data.verstorbeneFamilienstand === "verheiratet" ||
          data.verstorbeneFamilienstand === "verwitwet" ||
          data.verstorbeneFamilienstand === "geschieden") &&
        beguenstigtenArray.safeParse(data.beguenstigten).success,
      target: "spouseName",
    },
    {
      guard: (data) =>
        data.verstorbeneFamilienstand === "ledig" &&
        data.testamentArt === "none" &&
        beguenstigtenArray.safeParse(data.beguenstigten).success,
      target: "hatteKinder",
    },
    {
      guard: (data) => beguenstigtenArray.safeParse(data.beguenstigten).success,
      target: "grundbesitz",
    },
  ],
  namedBeneficiaryName: "namedBeneficiaryRelationship",
  namedBeneficiaryRelationship: "namedBeneficiaryBirthday",
  namedBeneficiaryBirthday: [
    {
      guard: (data) => {
        const arrayIndex = firstArrayIndex(data.pageData);
        if (arrayIndex === undefined) return false;
        return data.beguenstigten?.at(arrayIndex)?.isAlive === "yes";
      },
      target: "namedBeneficiaryAddress",
    },
    {
      target: "namedBeneficiarySterbedatum",
    },
  ],
  namedBeneficiaryAddress: "namedBeneficiariesOverview",
  namedBeneficiarySterbedatum: "namedBeneficiariesOverview",
  namedBeneficiariesWarning: "namedBeneficiariesOverview",
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
