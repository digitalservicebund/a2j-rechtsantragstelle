import type { Translations } from "~/services/cms/index.server";

type ArrayElementProps = {
  title: string
  elementKey: string
};

type ArrayElementDataProps = {
  readonly sessionData?: Record<string, Record<string, string>[]>;
  readonly translations?: Translations;
  readonly arrayKey: string;
  readonly index: number;
};

const ArrayElementEntry = ({
  title,
  elementKey,
  sessionData,
  translations,
  arrayKey,
  index,
}: ArrayElementProps & ArrayElementDataProps) => {
  console.log("title", title);
  console.log("elementKey", elementKey);
  const value = String(
    sessionData?.[`${arrayKey}.${elementKey}.${index}`] ?? "",
  );
  console.log("value", value);
  const translated = translations?.[`${arrayKey}.${elementKey}.${value}`];

  return (
    <div className={"flex flex-row"}>
      <div className={"break-words w-full"}>
        <div className="flex flex-col gap-16">
          <span></span>
          <span>{title}</span>
          {/* <span>{translated ?? value}</span> */}
          <span>{elementKey}</span>
        </div>
      </div>
    </div>
  );
};

export default ArrayElementEntry;
