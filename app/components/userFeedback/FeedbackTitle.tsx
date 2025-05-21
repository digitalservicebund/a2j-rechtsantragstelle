import CheckCircleIcon from "@digitalservicebund/icons/CheckCircle";

export const FeedbackTitle = ({
  title,
  subtitle,
  innerRef,
}: {
  title: string;
  subtitle: string;
  innerRef?: React.Ref<HTMLParagraphElement>;
}) => {
  return (
    <div className="flex max-sm:flex-col sm:items-center text-base mb-[1em]">
      <CheckCircleIcon className="w-[2em] h-[1.5em] mr-[0.25em] text-green-600 " />
      <p className="font-bold mr-4" ref={innerRef} tabIndex={-1}>
        {title}
      </p>
      <p>{subtitle}</p>
    </div>
  );
};
