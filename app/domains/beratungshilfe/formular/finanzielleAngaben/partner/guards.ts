import { type GenericGuard } from "~/domains/guards.server";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./userData";

export type FinanzielleAngabenPartnerGuard =
  GenericGuard<BeratungshilfeFinanzielleAngabenPartnerUserData>;
export const hasPartnerschaftYes: FinanzielleAngabenPartnerGuard = ({
  context,
}) => context.partnerschaft === "yes";
export const hasZusammenleben: FinanzielleAngabenPartnerGuard = ({ context }) =>
  context.zusammenleben === "yes";
export const hasUnterhaltYes: FinanzielleAngabenPartnerGuard = ({ context }) =>
  context.unterhalt === "yes";
export const hasPartnerschaftNoOrWidowed: FinanzielleAngabenPartnerGuard = ({
  context,
}) => context.partnerschaft === "no" || context.partnerschaft === "widowed";
export const hasPartnerschaftYesAndZusammenlebenYes: FinanzielleAngabenPartnerGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.zusammenleben == "yes";
export const hasPartnerschaftYesAndZusammenlebenNo: FinanzielleAngabenPartnerGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.zusammenleben == "no";
export const hasPartnerEinkommenYes: FinanzielleAngabenPartnerGuard = ({
  context,
}) => context.partnerEinkommen === "yes";
export const hasPartnerschaftYesAndPartnerEinkommenYes: FinanzielleAngabenPartnerGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.partnerEinkommen == "yes";
export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo: FinanzielleAngabenPartnerGuard =
  ({ context }) =>
    hasPartnerschaftYesAndZusammenlebenNo({ context }) &&
    context.unterhalt == "no";
export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes: FinanzielleAngabenPartnerGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes";
