import type { FormStepProps } from "../FormStepProps";

export function Step({ id }: FormStepProps) {
  return (
    <div style={{ border: "solid black 1px", padding: "1rem" }}>
      <h3>Age step header</h3>
      <p>Age step description paragraph</p>
      <label>
        Age
        <input type="number" name="age" />
      </label>
    </div>
  );
}
