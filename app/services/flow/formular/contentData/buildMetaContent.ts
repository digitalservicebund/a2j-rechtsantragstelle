import { type Flow } from "~/domains/flows.server";
import { type StrapiMeta } from "~/services/cms/models/StrapiMeta";
import { stepMeta } from "~/services/meta/formStepMeta";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { type UserDataWithPageData } from "../../pageData";

export const buildMetaContent = (
  currentFlow: Flow,
  pageMeta: StrapiMeta,
  parentMeta: StrapiMeta | null,
  userDataWithPageData: UserDataWithPageData,
) => {
  const stringReplacements =
    "stringReplacements" in currentFlow &&
    typeof currentFlow.stringReplacements === "function"
      ? currentFlow.stringReplacements(userDataWithPageData)
      : undefined;

  const meta = applyStringReplacement(
    stepMeta(pageMeta, parentMeta),
    stringReplacements,
  );

  return meta;
};
