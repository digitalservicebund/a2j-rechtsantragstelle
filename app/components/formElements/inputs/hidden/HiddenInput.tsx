import { useField } from "@rvf/react-router";

// Each subfield needs its own useField call, since RVF only supports one live serializer ref per field name.
const HiddenSubfieldInput = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => {
  const { getHiddenInputProps } = useField(name);
  return (
    <input
      {...getHiddenInputProps()}
      id={name}
      data-testid={`hidden-input-${name}`}
      value={value}
    />
  );
};

const HiddenInput = ({ name }: { name: string }) => {
  const { getInputProps } = useField(name);
  const inputProps = getInputProps();
  if (typeof inputProps.defaultValue === "object") {
    return (
      <>
        {Object.entries(inputProps.defaultValue)
          .filter(([_, value]) => value)
          .map(([key, val]) => (
            <HiddenSubfieldInput
              key={key}
              name={`${name}.${key}`}
              value={val as string}
            />
          ))}
      </>
    );
  }
  return <input {...inputProps} id={name} hidden />;
};

export default HiddenInput;
