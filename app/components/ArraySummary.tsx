import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import ArrayElement, { ArrayElementPropsSchema } from "./ArrayElement";
import type { Translations } from "~/services/cms/index.server";
import { Replacements } from "~/util/fillTemplate";

export const ArraySummaryPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema,
  arrayKey: z.string(),
  editButtonText: z.string(),
  deleteButtonText: z.string(),
  addButtonText: z.string(),
  items: z.array(ArrayElementPropsSchema),
});

type ArraySummaryProps = z.infer<typeof ArraySummaryPropsSchema>;
type ArraySummaryDataProps = {
  readonly sessionData?: Record<string, unknown>;
  readonly translations?: Translations;
};

const ArraySummary = ({
  identifier,
  heading,
  arrayKey,
  editButtonText,
  deleteButtonText,
  addButtonText,
  items,
  translations,
  sessionData,
}: ArraySummaryProps & ArraySummaryDataProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40">
      {heading && <Heading {...heading} />}
      <div className="ds-stack-32 bg-white p-16 pb-[24px]">
        {items.map((item, index) => {
          return (
            <div key={index} className="first:pt-0 scroll-my-40">
              <ArrayElement
                {...item}
                translations={translations}
                arrayKey={arrayKey}
                sessionData={sessionData}
                index={0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArraySummary;
