import type { GenericGuard } from "~/flows/guards.server";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import type { KinderContext } from "./context";

const hasKinderYes: KinderGuard = ({ context }) => context.hasKinder === "yes";

export type KinderGuard = GenericGuard<KinderContext>;

const hasKinderYesAndEmptyArray: KinderGuard = ({ context }) =>
  hasKinderYes({ context }) && !arrayIsNonEmpty(context.kinder);

export const kindWohnortBeiAntragstellerYes: KinderGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kinderWohnortBeiAntragsteller =
    kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
  return (
    kinderWohnortBeiAntragsteller === "yes" ||
    kinderWohnortBeiAntragsteller === "partially"
  );
};

export const kindWohnortBeiAntragstellerNo: KinderGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.wohnortBeiAntragsteller === "no";
};
export const kindEigeneEinnahmenYes: KinderGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.eigeneEinnahmen === "yes";
};
export const kindUnterhaltYes: KinderGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "yes";
};
export const kindUnterhaltNo: KinderGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "no";
};
export const isValidKinderArrayIndex: KinderGuard = ({
  context: { pageData, kinder },
}) => isValidArrayIndex(kinder, pageData);

export const kinderGuards = {
  hasKinderYes,
  hasKinderYesAndEmptyArray,
  kindWohnortBeiAntragstellerYes,
  kindWohnortBeiAntragstellerNo,
  kindEigeneEinnahmenYes,
  kindUnterhaltYes,
  kindUnterhaltNo,
  isValidKinderArrayIndex,
};
