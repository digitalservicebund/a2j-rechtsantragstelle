import { getPfaendungsfreibetraegeStrings } from "~/domains/kontopfaendung/wegweiser/stringReplacements";

export const globalStringReplacements = () => ({
  ...getPfaendungsfreibetraegeStrings(),
});
