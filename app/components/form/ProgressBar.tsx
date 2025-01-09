type ProgressBarProps = {
  readonly progress?: number;
  readonly max?: number;
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
    <div>
      {label && (
        <label htmlFor={id} className="sr-only">
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
        className="progress-bar w-full align-top border-0 h-4 bg-blue-500"
      >
        {`Schritt ${progress} von ${max}`}
      </progress>
    </div>
  );
}
