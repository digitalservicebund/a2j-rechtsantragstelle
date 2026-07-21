import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { beguenstigtenArray } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";

export const testamentOderErbvertragFlowConfig = {
  testamentArt: [
    {
      guard: (data) =>
        data.testamentArt === "none" &&
        data.verstorbeneFamilienstand === "ledig",
      target: "angehoerigeOverview",
    },
    {
      guard: (data) =>
        data.testamentArt === "none" &&
        (data.verstorbeneFamilienstand === "verheiratet" ||
          data.verstorbeneFamilienstand === "verwitwet" ||
          data.verstorbeneFamilienstand === "geschieden"),
      target: "spouseName",
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
        data.verstorbeneFamilienstand === "ledig" &&
        beguenstigtenArray.safeParse(data.beguenstigten).success,
      target: "angehoerigeOverview",
    },
    {
      guard: (data) =>
        data.verstorbeneFamilienstand === "verheiratet" ||
        data.verstorbeneFamilienstand === "verwitwet" ||
        data.verstorbeneFamilienstand === "geschieden",
      target: "spouseName",
    },
  ],
  namedBeneficiaryName: "namedBeneficiaryRelationship",
  namedBeneficiaryRelationship: "namedBeneficiaryBirthday",
  namedBeneficiaryBirthday: [
    {
      guard: (data) => {
        const arrayIndex = firstArrayIndex(data.pageData);
        if (arrayIndex === undefined) return false;
        const aliveStatus = data.beguenstigten?.at(arrayIndex)?.isAlive;
        return (
          aliveStatus === "yes" || aliveStatus === "noButAliveWhenErblasserDied"
        );
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
