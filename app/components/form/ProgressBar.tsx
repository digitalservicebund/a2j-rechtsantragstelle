interface ProgressBarProps {
  progress: number;
  max?: number;
  fallback?: string;
}

export function ProgressBar({ progress, max, fallback }: ProgressBarProps) {
  return (
    <progress
      value={progress}
      max={max}
      aria-label="vorab-check progress"
      className="progress-bar w-full align-top"
    >
      {fallback}
    </progress>
  );
}
