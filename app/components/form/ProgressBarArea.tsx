import { ProgressBar } from "~/components/form/ProgressBar";

type ProgressBarAreaProps = {
  label?: string;
  progressStep: number;
  progressTotal: number;
};

const ProgressBarArea = ({
  label,
  progressStep,
  progressTotal,
}: ProgressBarAreaProps) => {
  const progressBarId = "progress-bar";
  return (
    <div>
      <label htmlFor={progressBarId} className="ds-label-03-reg mb-4">
        {label}
      </label>
      <ProgressBar
        progress={progressStep}
        max={progressTotal}
        fallback={`Schritt ${progressStep} von ${progressTotal}`}
        id={progressBarId}
      />
    </div>
  );
};
export default ProgressBarArea;
