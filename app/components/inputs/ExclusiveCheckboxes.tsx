import { useField } from "@rvf/react-router";
import Checkbox from "~/components/inputs/Checkbox";
import InputError from "~/components/inputs/InputError";
import { type StrapiCheckboxComponent } from "~/services/cms/components/StrapiCheckbox";

type ExclusiveCheckboxesProps = Readonly<{
  name: string;
  checkboxes: StrapiCheckboxComponent[];
}>;

export const ExclusiveCheckboxes = ({
  name,
  checkboxes,
}: ExclusiveCheckboxesProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  return (
    <div>
      {checkboxes
        .filter((c) => c.name !== `${name}.none`)
        .map((c) => (
          <Checkbox name={c.name} label={c.label} key={c.name} />
        ))}
      <input
        type="hidden"
        name={`${name}.__component`}
        value="form-elements.exclusive-checkbox"
      />
      <p className="ds-label-01-reg">oder</p>
      <Checkbox
        name={`${name}.none`}
        key={`${name}.none`}
        label={"Nichts trifft zu"}
      />
      {field.error() && <InputError id={errorId}>{field.error()}</InputError>}
    </div>
  );
};
