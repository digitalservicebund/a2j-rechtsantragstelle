import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";

export const getRechtsproblemStrings = (
  context: BeratungshilfeFormularUserData,
) => {
  return {
    rechtsProblemIsAuthorities: context.bereich === "authorities",
    rechtsProblemIsLiving: context.bereich === "living",
    rechtsProblemIsWork: context.bereich === "work",
    rechtsProblemIsSeparation: context.bereich === "separation",
    rechtsProblemIsTrade: context.bereich === "trade",
    rechtsProblemIsDebt: context.bereich === "debt",
    rechtsProblemIsInheritance: context.bereich === "inheritance",
    rechtsProblemIsCriminalProcedure: context.bereich === "criminalProcedure",
    rechtsProblemIsOther: context.bereich === "other",
  };
};
