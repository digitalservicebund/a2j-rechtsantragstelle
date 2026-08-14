import { type FlowId } from "~/domains/flowIds";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { type FlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type Replacements } from "~/util/applyStringReplacement";

// Information about the current page, handed to a flow's optional loader hooks
// so they can compute page-specific extras (e.g. which list item the user is in).
export type LoaderExtrasContext = {
  flowId: FlowId;
  arrayIndexes?: number[];
  flowSessionEngine: FlowSession<PageConfigMap>;
};

// Optional per-flow hooks. A flow that needs nothing beyond the shared behavior
// passes no extras and is served exactly as before.
export type LoaderExtras<
  ExtraData extends Record<string, unknown> = Record<string, never>,
> = {
  // Extra CMS text placeholders that depend on the current page. Merged into the
  // content after the flow's static replacements, so these win.
  buildReplacements?: (
    context: LoaderExtrasContext,
  ) => Replacements | Promise<Replacements>;
  // Extra values to add to the loader's returned data (and, if it returns a
  // `formElements` field, a replacement for the default form elements). Runs
  // after the content is built, so it receives the default form elements to extend.
  buildLoaderData?: (
    context: LoaderExtrasContext & {
      formElements: StrapiFormComponent[];
    },
  ) => ExtraData | Promise<ExtraData>;
};
