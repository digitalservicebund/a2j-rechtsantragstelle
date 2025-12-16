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
        <span
          className="kern-icon kern-icon--success kern-icon--default mr-kern-space-x-small"
          aria-hidden="true"
        ></span>
        <p className="font-bold mr-4" ref={innerRef} tabIndex={-1}>
          {translations.feedback["success-message"].de}
        </p>
      </div>
      <p>{subtitle}</p>
    </output>
  );
};
