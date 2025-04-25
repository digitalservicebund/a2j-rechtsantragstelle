export const splitFieldName = (fieldName: string) => ({
  fieldName: fieldName.split("[")[0],
  inputIndex: Number(
    RegExp(/\[\d+\]/)
      .exec(fieldName)?.[0]
      .replaceAll(/[[\]]/g, ""),
  ),
});
