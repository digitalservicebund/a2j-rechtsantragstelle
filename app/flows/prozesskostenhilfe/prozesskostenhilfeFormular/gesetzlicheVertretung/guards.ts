import type { ProzesskostenhilfeGesetzlicheVertretung } from "./context";

export function hasGesetzlicheVertretungYes({
  context,
}: {
  context: ProzesskostenhilfeGesetzlicheVertretung;
}): boolean {
  return Boolean(context.hasGesetzlicheVertretung === "yes");
}
