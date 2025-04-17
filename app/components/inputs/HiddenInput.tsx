import { useField } from "@rvf/remix";

export type HiddenInputProps = {
  name: string;
};

const HiddenInput = ({ name }: HiddenInputProps) => {
  const { getInputProps } = useField(name);

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
