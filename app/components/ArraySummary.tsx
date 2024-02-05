import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import ArrayElement, { ArrayElementPropsSchema } from "./ArrayElement";
import type { Translations } from "~/services/cms/index.server";

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

const ArraySummary = ({
  identifier,
  heading,
  arrayKey,
  editButtonText,
  deleteButtonText,
  addButtonText,
  items,
}: ArraySummaryProps & { readonly templateReplacements?: Translations }) => {
  return (
    <div className="ds-stack-8 scroll-my-40">
      {heading && <Heading {...heading} />}
      <ol className="list-none ds-stack-32 ps-0">
        {items.map((item, index) => (
          <li key={index} className="first:pt-0 scroll-my-40">
            <ArrayElement {...item} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ArraySummary;
