import { type Survey } from "posthog-js";
import { useState } from "react";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";

type PosthogSurveyProps = {
  survey: Survey;
  closeSurvey: () => void;
};

export const PosthogSurvey = ({ survey, closeSurvey }: PosthogSurveyProps) => {
  const [isComplete, setIsComplete] = useState(false);
  console.log(survey);
  return (
    <div className="border-2 border-blue-800 bg-white absolute bottom-[80%] p-24">
      <SurveyButtons
        isComplete={isComplete}
        closeSurvey={closeSurvey}
        submitSurvey={() => setIsComplete(true)}
      />
    </div>
  );
};

type SurveyButtonsProps = {
  isComplete: boolean;
  submitSurvey: () => void;
} & Pick<PosthogSurveyProps, "closeSurvey">;

const SurveyButtons = ({
  isComplete,
  closeSurvey,
  submitSurvey,
}: SurveyButtonsProps) => {
  return (
    <ButtonContainer>
      <Button
        look={isComplete ? "primary" : "tertiary"}
        onClick={closeSurvey}
        text={isComplete ? "Schließen" : "Abbrechen"}
      />
      {!isComplete && (
        <Button look="primary" text="Problem absenden" onClick={submitSurvey} />
      )}
    </ButtonContainer>
  );
};
