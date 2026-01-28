type KernProgressBarProps = {
  readonly progress: number;
  readonly max: number;
  readonly fallback?: string;
  readonly label: string;
};

export function KernProgress({
  progress,
  max,
  fallback,
  label,
}: KernProgressBarProps) {
  const id = "progress-bar";
  return (
    <div className="kern-progress">
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
