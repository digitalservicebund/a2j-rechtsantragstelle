import type { FormStepProps } from "../FormStepProps";

export function Step({ id }: FormStepProps) {
  return (
    <div style={{ border: "solid black 1px", padding: "1rem" }}>
      <h2>Welcome header</h2>
      <p>Welcome paragraph</p>
    </div>
  );
}
