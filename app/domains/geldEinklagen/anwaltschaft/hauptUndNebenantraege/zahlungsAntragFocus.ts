export const focusOnZahlungsAntrag = (itemIndex: number) => {
  setTimeout(() => {
    const element =
      document.getElementById(`zahlungsAntrag-${itemIndex}`) ??
      document.getElementById("zahlungsantrag-heading");

    element?.focus();
  }, 100);
};
