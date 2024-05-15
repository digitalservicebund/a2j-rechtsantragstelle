import RichText from "./RichText";
import { z } from "zod";

export const DetailsSummarySchema = z.object({
  identifier: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
});

type DetailsSummaryProps = z.infer<typeof DetailsSummarySchema>;

export const DetailsSummary = ({ title, content }: DetailsSummaryProps) => {
  return (
    <details className="details focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold bg-no-repeat">
      <summary className="summary-content focus:outline-none cursor-pointer pl-[23px] list-none">
        {title}
      </summary>
      <span className="block ds-label-01-reg ml-[7px] border-l-2 border-solid border-blue-500 pl-12 pt-8 text-black">
        {content && <RichText markdown={content} />}
      </span>
    </details>
  );
};
