import { type GeldEinklagenFormularUserData } from "./userData";

export const isBeklagtePerson = (context: GeldEinklagenFormularUserData) => {
  return { isBeklagtePerson: context.gegenWenBeklagen === "person" };
};

export const hasClaimVertrag = (context: GeldEinklagenFormularUserData) => {
  return {
    hasClaimVertrag:
      context.versicherungVertrag === "yes" ||
      context.klagendeVertrag === "yes" ||
      context.mietePachtVertrag === "yes",
  };
};
