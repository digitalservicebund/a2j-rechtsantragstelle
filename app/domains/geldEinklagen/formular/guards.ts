import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import type { Guards } from "../../guards.server";

export const guards = {
  gegenseiteTypPrivatperson: ({ context }) =>
    context.gegenseite?.typ === "privatperson",
  gegenseiteTypUnternehmen: ({ context }) =>
    context.gegenseite?.typ === "unternehmen",
} satisfies Guards<GeldEinklagenFormularUserData>;
