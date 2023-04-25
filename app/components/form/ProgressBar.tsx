interface ProgressBarProps {
  id: string;
  progress: number;
  max?: number;
  fallback?: string;
}

export function ProgressBar({ id, progress, max, fallback }: ProgressBarProps) {
  return (
    <progress
      id={id}
      value={progress}
      max={max}
      aria-label="vorab-check progress"
      className="progress-bar w-full align-top border-0 h-4 bg-blue-500"
    >
      {fallback}
    </progress>
  );
}
