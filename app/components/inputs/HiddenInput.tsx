import { useField } from "remix-validated-form";

interface Props {
  name: string;
  formId?: string;
}

const HiddenInput = ({ formId, name }: Props) => {
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
