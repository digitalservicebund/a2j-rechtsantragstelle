import { type SimulationResult } from "../simulate";
import { buildStatusTree } from "../statusTree";

const simulation = (): SimulationResult => ({
  keys: [],
  reachableSet: new Set(),
  isComplete: false,
});

describe("buildStatusTree", () => {
  describe("section ordering", () => {
    it("preserves flow-definition order of sibling sections regardless of name length", () => {
      const config = {
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
        kaufmann: { stepId: "/klage-erstellen/kaufmann" },
      };
      const tree = buildStatusTree(config, simulation(), new Set());
      expect(Object.keys(tree)).toEqual([
        "/gericht-pruefen",
        "/klage-erstellen",
      ]);
    });

    it("inserts parent sections before their nested children", () => {
      const config = {
        kaufmann: { stepId: "/klage-erstellen/kaufmann" },
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
        kaufmannAbbruch: {
          stepId: "/klage-erstellen/kaufmann/ergebnis/abbruch",
        },
      };
      const tree = buildStatusTree(config, simulation(), new Set());
      expect(Object.keys(tree)).toEqual([
        "/klage-erstellen",
        "/gericht-pruefen",
      ]);
      expect(Object.keys(tree["/klage-erstellen"].children ?? {})).toEqual([
        "/kaufmann",
      ]);
    });

    it("orders by nesting depth, not string length, so a deeply nested short name does not jump ahead of a shallow long-named sibling", () => {
      const config = {
        kaufmann: { stepId: "/klage-erstellen/kaufmann/ergebnis/abbruch" },
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen" },
      };
      const tree = buildStatusTree(config, simulation(), new Set());
      expect(Object.keys(tree)).toEqual([
        "/klage-erstellen",
        "/gericht-pruefen",
      ]);
      expect(Object.keys(tree["/klage-erstellen"].children ?? {})).toEqual([
        "/kaufmann",
      ]);
    });

    it("preserves child order within a nested section", () => {
      const config = {
        gegenWen: { stepId: "/gericht-pruefen/gegen-wen/start" },
        kaufmann: { stepId: "/gericht-pruefen/kaufmann/start" },
        postleitzahl: {
          stepId: "/gericht-pruefen/postleitzahl-beklagte-person/start",
        },
      };
      const tree = buildStatusTree(config, simulation(), new Set());
      expect(Object.keys(tree["/gericht-pruefen"].children ?? {})).toEqual([
        "/gegen-wen",
        "/kaufmann",
        "/postleitzahl-beklagte-person",
      ]);
    });
  });

  it("should not create a child node when shouldCollapseIntoParentNavItem is true for the first level", () => {
    const config = {
      // A non-collapsed page anchors the "/nachlass" section that the collapsed
      // array pages attach to.
      vermoegen: { stepId: "/nachlass/vermoegen-frage" },
      grundbesitz: {
        stepId: "/nachlass/grundbesitz/grundbesitz-frage",
        shouldCollapseIntoParentNavItem: true,
      },
      grundBesitzOverview: {
        stepId: "/nachlass/grundbesitz/uebersicht",
        shouldCollapseIntoParentNavItem: true,
      },
      grundbesitzAdresse: {
        stepId: "/nachlass/grundbesitz/#/adresse",
        shouldCollapseIntoParentNavItem: true,
      },
      grundbesitzWarnung: {
        stepId: "/nachlass/grundbesitz/warnung",
        shouldCollapseIntoParentNavItem: true,
      },
      unternehmenName: {
        stepId: "/nachlass/unternehmen/#/name",
        shouldCollapseIntoParentNavItem: true,
      },
    };
    const tree = buildStatusTree(config, simulation(), new Set());

    expect(tree["/nachlass"]).toBeDefined();
    expect(tree["/nachlass"].children).not.toHaveProperty("/grundbesitz");
    expect(tree["/nachlass"].children).not.toHaveProperty("/unternehmen");
  });

  it("collapses an array whose item URL has an extra folder before the wildcard into the array's parent section, not the array-group folder", () => {
    // Beratungshilfe eigentum arrays: "…/eigentum/<group>/<itemBase>/#/…".
    // "eigentum" is a real (non-collapsed) section; the group folder is not, so
    // the whole array must collapse into "eigentum", never into "…/bankkonten".
    const config = {
      eigentumInfo: { stepId: "/finanzielle-angaben/eigentum/eigentum-info" },
      bankkontenFrage: {
        stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
        shouldCollapseIntoParentNavItem: true,
      },
      bankkontenUebersicht: {
        stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
        shouldCollapseIntoParentNavItem: true,
      },
      bankkonto: {
        stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonto/#/daten",
        shouldCollapseIntoParentNavItem: true,
      },
    };
    const tree = buildStatusTree(config, simulation(), new Set());

    const eigentum = tree["/finanzielle-angaben"].children?.["/eigentum"];
    expect(eigentum).toBeDefined();
    expect(eigentum?.children ?? {}).not.toHaveProperty("/bankkonten");
  });

  it("should not create a child node when shouldCollapseIntoParentNavItem is true for nested levels", () => {
    const config = {
      uebersicht: {
        stepId: "/klage-erstellen/begruendung/beschreibung/uebersicht",
      },
      abschnitte: {
        stepId: "/klage-erstellen/begruendung/beschreibung/abschnitte/#",
        shouldCollapseIntoParentNavItem: true,
      },
      abschnitteBeweisDokument: {
        stepId:
          "/klage-erstellen/begruendung/beschreibung/abschnitte/#/beweis-dokumente/#/daten",
        shouldCollapseIntoParentNavItem: true,
      },
      abschnitteBeweisPersonAuswahl: {
        stepId:
          "/klage-erstellen/begruendung/beschreibung/abschnitte/#/beweis-person/#/auswahl",
        shouldCollapseIntoParentNavItem: true,
      },
      abschnitteBeweisPerson: {
        stepId:
          "/klage-erstellen/begruendung/beschreibung/abschnitte/#/beweis-person/#/daten",
        shouldCollapseIntoParentNavItem: true,
      },
    };
    const tree = buildStatusTree(config, simulation(), new Set());

    expect(tree["/klage-erstellen"].children).toHaveProperty("/begruendung");
    expect(
      tree["/klage-erstellen"].children?.["/begruendung"].children,
    ).toHaveProperty("/beschreibung");

    expect(
      tree["/klage-erstellen"].children?.["/begruendung"].children?.[
        "/beschreibung"
      ].children,
    ).not.toHaveProperty("/abschnitte");
  });
});
