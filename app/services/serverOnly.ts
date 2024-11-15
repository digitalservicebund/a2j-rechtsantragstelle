import { serverOnly$ } from "vite-env-only/macros";

// The unusual "import.meta.env &&" logic is used to allow tsx scripts to consume serverOnly$() without running vite, see https://github.com/pcattori/vite-env-only/issues/19
// At the time of writing, 'scripts/unusedStrapiEntries.ts' imports { flows } from "~/domains/flows.server", which then pulls in the schema below
export const serverOnly = <T>(val: T): T | undefined =>
  import.meta.env && serverOnly$(val);
