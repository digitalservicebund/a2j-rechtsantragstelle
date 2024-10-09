import { z } from "zod";
import RichText from "./RichText";

export const DetailsSummarySchema = z.object({
  identifier: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export type DetailsSummaryProps = z.infer<typeof DetailsSummarySchema>;

export const DetailsSummary = ({ title, content }: DetailsSummaryProps) => {
  return (
    <details className="details focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold">
      <summary className="summary-content inline-flex focus:outline-none cursor-pointer list-none bg-no-repeat pl-[24px]">
        {title}
      </summary>
      <span className="block ds-label-01-reg pt-4  pl-[24px] text-black">
        {content && <RichText markdown={content} />}
      </span>
    </details>
  );
};
