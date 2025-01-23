import { useField } from "remix-validated-form";

export type HiddenInputProps = {
  name: string;
  formId?: string;
};

const HiddenInput = ({ formId, name }: HiddenInputProps) => {
  const { getInputProps } = useField(name, { formId });

  return (
    <input
      {...getInputProps({
        id: name,
      })}
      hidden
    />
  );
};

export default HiddenInput;
