export const getAbsaetzeBaseUrl = (
  hauptantragIndex: number,
  nebenantragIndex?: number,
) => {
  const nebenantragSlug =
    nebenantragIndex !== undefined ? `/nebenantrag/${nebenantragIndex}` : "";
  return `/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/${hauptantragIndex}${nebenantragSlug}/absaetze`;
};

export const getNebenantragDisplayIndex = (
  index: number,
  parentIndex: number,
) =>
  `${parentIndex + 1}${String.fromCodePoint(("a".codePointAt(0) ?? 0) + index)}`;
