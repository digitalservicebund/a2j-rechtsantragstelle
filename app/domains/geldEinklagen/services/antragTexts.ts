// Shared by the PDF and the XJustiz message, so both state the same Antraege.

const ZINSEN =
  "Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit";

const zinsenZusatz = (prozesszinsen?: string) =>
  prozesszinsen === "yes" ? ` nebst ${ZINSEN}` : "";

export const hauptforderungAntragText = (
  betrag: string,
  prozesszinsen?: string,
) =>
  `Die beklagte Partei wird verurteilt, an die klagende Partei ${betrag} Euro${zinsenZusatz(prozesszinsen)} zu zahlen.`;

export const anwaltskostenAntragText = (
  betrag: string,
  prozesszinsen?: string,
) =>
  `Die beklagte Partei wird verurteilt die außergerichtlich angefallenen Anwaltskosten in Höhe von ${betrag} Euro${zinsenZusatz(prozesszinsen)} zu zahlen.`;

export const zinsenAntragText = `Die beklagte Partei wird verurteilt, ${ZINSEN} zu zahlen.`;
