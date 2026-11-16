// Shared by the PDF and the XJustiz message, so both state the same Antraege.

export const KLAGE_TITEL = "Klage";
export const KLAGE_UNTERTITEL =
  "im Online-Verfahren nach Buch 12 Abschnitt 2 der Zivilprozessordnung";

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

export const muendlicheVerhandlungText = (muendlicheVerhandlung?: string) =>
  muendlicheVerhandlung === "yes"
    ? "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen."
    : "";

const VIDEOVERHANDLUNG_TEXTE: Record<string, string> = {
  yes: "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.",
  no: "Gegen die Durchführung einer Verhandlung per Video bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.",
};

export const videoVerhandlungText = (videoVerhandlung?: string) =>
  VIDEOVERHANDLUNG_TEXTE[videoVerhandlung ?? ""] ?? "";
