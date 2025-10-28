import { type GeldEinklagenFormularUserData } from "./userData";

export const isBeklagtePerson = (context: GeldEinklagenFormularUserData) => {
  return { isBeklagtePerson: context.gegenWenBeklagen === "person" };
};
