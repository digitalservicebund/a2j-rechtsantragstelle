import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";

export const getRechtsproblemStrings = (
  context: BeratungshilfeFormularContext,
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
