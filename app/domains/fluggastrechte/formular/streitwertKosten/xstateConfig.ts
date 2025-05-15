export const fluggastrechteStreitwertKosten = {
  id: "streitwert-kosten",
  initial: "gerichtskosten",
  states: {
    gerichtskosten: {
      on: {
        SUBMIT: "andere-kosten",
        BACK: "#grundvoraussetzungen.amtsgericht",
      },
    },
    "andere-kosten": {
      on: {
        SUBMIT: "prozesszinsen",
        BACK: "gerichtskosten",
      },
    },
    prozesszinsen: {
      on: {
        SUBMIT: [
          {
            target: "#flugdaten.adresse-fluggesellschaft",
            guard: "streitwertKostenDone",
          },
        ],
        BACK: "andere-kosten",
      },
    },
  },
};
