import { useField } from "@rvf/react-router";

const HiddenInput = ({ name }: { name: string }) => {
  const { getInputProps, getHiddenInputProps } = useField(name);
  const inputProps = getInputProps();
  if (typeof inputProps.defaultValue === "object") {
    return (
      <>
        {Object.entries(inputProps.defaultValue).map(([key, value]) => (
          <input
            {...getHiddenInputProps()}
            id={name}
            key={key}
            data-testid={`hidden-input-${name}.${key}`}
            name={`${name}.${key}`}
            value={value as string}
            hidden
          />
        ))}
      </>
    );
  }
  return <input {...inputProps} id={name} hidden />;
};

export default HiddenInput;
