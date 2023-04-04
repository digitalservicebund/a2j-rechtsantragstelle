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
        className="w-full align-top"
        style={{
          height: "0.75rem",
          accentColor: "var(--color-ui-primary)",
        }}
      >
        {fallback}
      </progress>
    );
  }
  