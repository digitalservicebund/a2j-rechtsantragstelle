import { z } from "zod";

export const ArrayElementPropsSchema = z.object({
  title: z.string(),
  elementKey: z.string(),
});

type ArrayElementProps = z.infer<typeof ArrayElementPropsSchema>;

const ArrayElement = ({ title, elementKey }: ArrayElementProps) => {
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
