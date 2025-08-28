import { useField } from "@rvf/react-router";

const HiddenInput = ({ name }: { name: string }) => (
  <input {...useField(name).getInputProps({ id: name })} hidden />
);

export default HiddenInput;
