import { z } from "zod";
import type { Translations } from "~/services/cms/index.server";

export const ArrayElementPropsSchema = z.object({
  title: z.string(),
  key: z.string(),
});

type ArrayElementProps = z.infer<typeof ArrayElementPropsSchema>;

const ArrayElement = ({
  title,
  key,
}: ArrayElementProps & { readonly translations?: Translations }) => {
  console.log("Array Element", title, key);

  return (
    <div className={"flex flex-row items-center justify-center"}>
      <div className={"break-words w-full"}>
        <div className="flex flex-row gap-16 items-center"></div>
      </div>
    </div>
  );
};

export default ArrayElement;
