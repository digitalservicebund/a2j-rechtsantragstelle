import { ProgressBar } from "~/components/form/ProgressBar";

type ProgressBarAreaProps = {
  label: string;
  stepProgress: number;
  progressTotal: number;
};

const ProgressBarArea = ({
  label,
  stepProgress,
  progressTotal,
}: ProgressBarAreaProps) => {
  return (
    <div>
      <p className="ds-label-03-reg mb-4">{label}</p>
      <ProgressBar
        progress={stepProgress}
        max={progressTotal}
        fallback={`Schritt ${stepProgress} / ${progressTotal}`}
      />
    </div>
  );
};
export default ProgressBarArea;
