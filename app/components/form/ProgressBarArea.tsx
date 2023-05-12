import { ProgressBar } from "~/components/form/ProgressBar";

type ProgressBarAreaProps = {
  label?: string;
  stepProgress: number;
  progressTotal: number;
};

const ProgressBarArea = ({
  label,
  stepProgress,
  progressTotal,
}: ProgressBarAreaProps) => {
  const progressBarId = "progress-bar";
  return (
    <div>
      <label htmlFor={progressBarId} className="ds-label-03-reg mb-4">
        {label}
      </label>
      <ProgressBar
        progress={stepProgress}
        max={progressTotal}
        fallback={`Schritt ${stepProgress} von ${progressTotal}`}
        id={progressBarId}
      />
    </div>
  );
};
export default ProgressBarArea;
