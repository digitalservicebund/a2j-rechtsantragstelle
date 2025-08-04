import CheckCircleIcon from "@digitalservicebund/icons/CheckCircle";
import { translations } from "~/services/translations/translations";

export const FeedbackSuccessMessage = ({
  subtitle,
  innerRef,
}: {
  subtitle: string;
  innerRef?: React.Ref<HTMLParagraphElement>;
}) => {
  return (
    <output className="flex max-sm:flex-col sm:items-center text-base mb-[1em]">
      <CheckCircleIcon className="w-[2em] h-[1.5em] mr-[0.25em] text-green-600 " />
      <p className="font-bold mr-4" ref={innerRef} tabIndex={-1}>
        {translations.feedback["success-message"].de}
      </p>
      <p>{subtitle}</p>
    </output>
  );
};
