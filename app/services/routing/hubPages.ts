export const hubPages = new Set(["finanzielle-hilfen", "nachlass"]);

export const tableOfContents = {
  "/finanzielle-hilfen": [
    { url: "#intro", text: "Beratungshilfe und Prozesskostenhilfe" },
    {
      url: "#unterschiede",
      text: "Unterschiede und Gemeinsamkeiten von Beratungshilfe und Prozesskostenhilfe",
    },
    {
      url: "#weitere-beratungsmoeglichkeiten",
      text: "Weitere Beratungsmöglichkeiten",
    },
  ],
  "/nachlass": [
    { url: "/", text: "Kurz erklärt" },
    { url: "/", text: "Unter diesen Bedingungen können Sie erben" },
    { url: "/", text: "Prüfen Sie das Erbe" },
    { url: "/", text: "Erbausschlagung: Ein Erbe ablehnen" },
    { url: "/", text: "Erbschein: Ein Erbe nachweisen" },
    { url: "/", text: "Erbschaftssteuer" },
  ],
};
