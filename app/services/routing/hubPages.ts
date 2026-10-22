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
    { url: "#kurz", text: "Kurz erklärt" },
    { url: "#erben", text: "Unter diesen Bedingungen können Sie erben" },
    { url: "#pruefen", text: "Prüfen Sie das Erbe" },
    { url: "#erbausschlagung", text: "Erbausschlagung: Ein Erbe ablehnen" },
    { url: "#erbschein", text: "Erbschein: Ein Erbe nachweisen" },
    { url: "#steuer", text: "Erbschaftssteuer" },
  ],
};
