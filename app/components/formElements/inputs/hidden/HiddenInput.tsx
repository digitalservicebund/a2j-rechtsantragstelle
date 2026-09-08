import { useField } from "@rvf/react-router";

const HiddenInput = ({ name }: { name: string }) => {
  const { getInputProps } = useField(name);
  const inputProps = getInputProps();
  if (typeof inputProps.defaultValue === "object") {
    return (
      <>
        {Object.entries(inputProps.defaultValue).map(([key, value]) => (
          <input
            key={key}
            data-testid={`hidden-input-${key}.${name}`}
            name={`${name}.${key}`}
            value={value as string}
            hidden
            readOnly
          />
        ))}
      </>
    );
  }
  return <input {...inputProps} hidden readOnly />;
};

export default HiddenInput;
