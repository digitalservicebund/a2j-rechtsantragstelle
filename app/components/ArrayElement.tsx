import { z } from "zod";
import type { Translations } from "~/services/cms/index.server";

export const ArrayElementPropsSchema = z.object({
  title: z.string(),
  elementKey: z.string(),
});

type ArrayElementProps = z.infer<typeof ArrayElementPropsSchema>;

const ArrayElement = ({
  title,
  elementKey,
  templateReplacements,
}: ArrayElementProps & { readonly templateReplacements?: Translations }) => {
  return (
    <div className={"flex flex-row items-center justify-center"}>
      <div className={"break-words w-full"}>
        <div className="flex flex-row gap-16 items-center">{title}</div>
        {elementKey}
      </div>
    </div>
  );
};

export default ArrayElement;
