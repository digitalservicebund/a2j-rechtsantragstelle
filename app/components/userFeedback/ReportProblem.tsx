import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import Button from "~/components/Button";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";

export const ReportProblem = () => {
  const feedbackTranslations = useFeedbackTranslations();
  return (
    <div className="p-24 justify-end flex">
      <Button
        look="tertiary"
        id="survey-button"
        className="h-40 px-24 py-10 min-w-full justify-center sm:min-w-fit"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      ></Button>
    </div>
  );
};
