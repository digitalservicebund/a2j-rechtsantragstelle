import { useField } from "remix-validated-form";

export function useStringField(
  name: string,
  options?: Parameters<typeof useField>[1],
) {
  const { defaultValue, ...props } = useField(name, options);
  return {
    ...props,
    defaultValue: typeof defaultValue === "string" ? defaultValue : undefined,
  };
}
