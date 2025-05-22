import type { ProzesskostenhilfeGesetzlicheVertretungUserData } from "./userData";

export function hasGesetzlicheVertretungYes({
  context,
}: {
  context: ProzesskostenhilfeGesetzlicheVertretungUserData;
}): boolean {
  return Boolean(context.hasGesetzlicheVertretung === "yes");
}
