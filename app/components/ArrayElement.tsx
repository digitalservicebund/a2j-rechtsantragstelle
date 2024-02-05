import { z } from "zod";
import type { Translations } from "~/services/cms/index.server";

export const ArrayElementPropsSchema = z.object({
  title: z.string(),
  elementKey: z.string(),
});

type ArrayElementProps = z.infer<typeof ArrayElementPropsSchema>;

type ArrayElementDataProps = {
  readonly sessionData?: Record<string, unknown>;
  readonly translations?: Translations;
  readonly arrayKey: string;
  readonly index: number;
};

const ArrayElement = ({
  title,
  elementKey,
  sessionData,
  translations,
  arrayKey,
  index,
}: ArrayElementProps & ArrayElementDataProps) => {
  console.log(sessionData);
  console.log(`${arrayKey}.${elementKey}.${index}`);
  console.log(sessionData?.[`${arrayKey}.${elementKey}.${index}`]);
  const value = String(
    sessionData?.[`${arrayKey}.${elementKey}.${index}`] ?? "",
  );
  const translated = translations?.[`${arrayKey}.${elementKey}.${value}`];

  return (
    <div className={"flex flex-row"}>
      <div className={"break-words w-full"}>
        <div className="flex flex-col gap-16">
          <span>{title}</span>
          <span>{translated ?? value}</span>
        </div>
      </div>
    </div>
  );
};

export default ArrayElement;
