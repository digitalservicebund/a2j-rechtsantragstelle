import type { GeldEinklagenFormularContext } from "~/flows/geldEinklagen/geldEinklagenFormular/context";
import type { Guards } from "../../guards.server";

export const guards = {
  gegenseiteTypPrivatperson: ({ context }) =>
    context.gegenseite?.typ === "privatperson",
  gegenseiteTypUnternehmen: ({ context }) =>
    context.gegenseite?.typ === "unternehmen",
} satisfies Guards<GeldEinklagenFormularContext>;
