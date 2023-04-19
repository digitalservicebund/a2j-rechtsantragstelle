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
      className="progress-bar w-full align-top border-0 h-4 bg-blue-500"
    >
      {fallback}
    </progress>
  );
}
