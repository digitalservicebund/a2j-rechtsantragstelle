import {GeldEinklagenFormularContext} from "~/models/flows/geldEinklagenFormular/context";

const gegenseiteTypPrivatperson = (context: GeldEinklagenFormularContext) => {
  return context.gegenseite?.typ === "privatperson"
}

const gegenseiteTypUnternehmen = (context: GeldEinklagenFormularContext) => {
  return context.gegenseite?.typ === "unternehmen"
}

export const guards = {
  gegenseiteTypPrivatperson,
  gegenseiteTypUnternehmen
};
