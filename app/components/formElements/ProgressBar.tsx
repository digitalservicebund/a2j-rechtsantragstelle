type ProgressBarProps = {
  readonly progress: number;
  readonly max: number;
  readonly fallback?: string;
  readonly label?: string;
};

export function ProgressBar({
  progress,
  max,
  fallback,
  label,
}: ProgressBarProps) {
  const id = "progress-bar";
  return (
    <div className="kern-progress pt-kern-space-x-large pb-kern-space-default">
      {label && (
        <label htmlFor={id} className="kern-label sr-only">
          {label}
        </label>
      )}
      <progress
        id={id}
        value={progress}
        max={max}
        aria-valuemin={1}
        aria-valuenow={progress}
        aria-valuemax={max}
        aria-label={fallback}
      >
        {`Schritt ${progress} von ${max}`}
      </progress>
    </div>
  );
}
