import { translations } from "~/services/translations/translations";

export const FeedbackSuccessMessage = ({
  subtitle,
  innerRef,
}: {
  subtitle: string;
  innerRef?: React.Ref<HTMLParagraphElement>;
}) => {
  return (
    <output className="flex flex-col gap-kern-space-small">
      <div className="flex items-center">
        <p className="font-bold mr-4" ref={innerRef} tabIndex={-1}>
          {translations.feedback["success-message"].de}
        </p>
      </div>
      <p>{subtitle}</p>
    </output>
  );
};
