import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { nachlassErbscheinAnfrageHappyPathData } from "~/domains/nachlass/erbschein/anfrage/__test__/mockTestData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { MAX_SUPPORTED_DESCENDANT_DEPTH } from "~/domains/nachlass/erbschein/shared/calculateInheritance";

type UserData = Parameters<typeof createFlowSession>[1];

const happyPathData: NachlassErbscheinAnfrageUserData = {
  ...nachlassErbscheinAnfrageHappyPathData,
  testamentArt: "none",
  verstorbeneFamilienstand: "ledig",
};

const person = {
  vorname: "Max",
  nachname: "Mustermann",
  geburtsdatum: { day: "01", month: "01", year: "1990" },
  geburtsort: "Musterstadt",
};

const living = { ...person, isAlive: "yes", strasse: "Musterstraße", hausnummer: "1", plz: "12345", ort: "Musterstadt", land: "Deutschland" }; // prettier-ignore
const deceased = { ...person, isAlive: "no", sterbedatum: { day: "01", month: "01", year: "2020" }, sterbeort: "Musterstadt" }; // prettier-ignore

// The 2nd order is only reached once the 1st order is extinct, so every case has
// to carry a kinder branch with no living descendants.
const extinctKinderBranch = { ...deceased, hatteKinder: "no" };

// depth 0 is the Elternteil itself; depth d is a sibling line d levels below it.
const siblingDepths = [1, 2, 3, 4, 5] as const;

// "/angehoerige/elternteile/#/kinder/#/lebend" for depth 1.
const pathAt = (depth: number, page: string) =>
  `/angehoerige/elternteile/#${"/kinder/#".repeat(depth)}/${page}`;

// Nests `leaf` under `depth` deceased ancestors that each said hatteKinder=yes.
const treeTo = (depth: number, leaf: object): object => {
  let node = leaf;
  for (let level = depth; level >= 1; level--) {
    node = { ...deceased, hatteKinder: "yes", kinder: [node] };
  }
  return {
    ...happyPathData,
    hatteKinder: "yes",
    kinder: [extinctKinderBranch],
    elternteile: [node],
  };
};

const sessionAt = (depth: number, page: string, leaf: object) =>
  createFlowSession(
    nachlassErbscheinAnfrageFlowConfig,
    {
      ...treeTo(depth, leaf),
      pageData: { arrayIndexes: Array(depth + 1).fill(0) },
    } as UserData,
    pathAt(depth, page),
  );

describe("elternteil navigation", () => {
  describe("the Elternteil itself", () => {
    it("collects name then birthday then alive-status", () => {
      expect(sessionAt(0, "name", living).nextPath).toBe(
        pathAt(0, "geburtsdatum"),
      );
      expect(sessionAt(0, "geburtsdatum", living).nextPath).toBe(
        pathAt(0, "lebend"),
      );
    });

    it("routes a living Elternteil to its address, then back to the summary", () => {
      expect(sessionAt(0, "lebend", living).nextPath).toBe(
        pathAt(0, "adresse"),
      );
      expect(sessionAt(0, "adresse", living).nextPath).toBe(
        "/angehoerige/elternteile/uebersicht",
      );
    });

    it("routes a deceased Elternteil to its death date, then to hatte-kinder", () => {
      const leaf = { ...deceased, hatteKinder: "no" };
      expect(sessionAt(0, "lebend", leaf).nextPath).toBe(
        pathAt(0, "sterbedatum"),
      );
      expect(sessionAt(0, "sterbedatum", leaf).nextPath).toBe(
        pathAt(0, "hatte-kinder"),
      );
    });

    it("returns to the summary when a deceased Elternteil had no children", () => {
      const leaf = { ...deceased, hatteKinder: "no" };
      expect(sessionAt(0, "hatte-kinder", leaf).nextPath).toBe(
        "/angehoerige/elternteile/uebersicht",
      );
    });

    it("exposes the sibling entry point while linear navigation returns to the summary", () => {
      const leaf = { ...deceased, hatteKinder: "yes", kinder: [living] };
      const session = sessionAt(0, "hatte-kinder", leaf);

      expect(session.nextArrayPath).toBe(pathAt(1, "name"));
      expect(session.nextPath).toBe("/angehoerige/elternteile/uebersicht");
    });
  });

  describe("sibling descendants at every supported depth", () => {
    it.each(siblingDepths)(
      "collects name then birthday then alive-status at depth %i",
      (depth) => {
        expect(sessionAt(depth, "name", living).nextPath).toBe(
          pathAt(depth, "geburtsdatum"),
        );
        expect(sessionAt(depth, "geburtsdatum", living).nextPath).toBe(
          pathAt(depth, "lebend"),
        );
      },
    );

    it.each(siblingDepths)(
      "routes a living descendant at depth %i to its address, then back to the summary",
      (depth) => {
        expect(sessionAt(depth, "lebend", living).nextPath).toBe(
          pathAt(depth, "adresse"),
        );
        expect(sessionAt(depth, "adresse", living).nextPath).toBe(
          "/angehoerige/elternteile/uebersicht",
        );
      },
    );

    it.each(siblingDepths)(
      "routes a deceased descendant at depth %i to its death date, then to hatte-kinder",
      (depth) => {
        const leaf = { ...deceased, hatteKinder: "no" };
        expect(sessionAt(depth, "lebend", leaf).nextPath).toBe(
          pathAt(depth, "sterbedatum"),
        );
        expect(sessionAt(depth, "sterbedatum", leaf).nextPath).toBe(
          pathAt(depth, "hatte-kinder"),
        );
      },
    );

    it.each(siblingDepths)(
      "returns to the summary when a deceased descendant at depth %i had no children",
      (depth) => {
        const leaf = { ...deceased, hatteKinder: "no" };
        expect(sessionAt(depth, "hatte-kinder", leaf).nextPath).toBe(
          "/angehoerige/elternteile/uebersicht",
        );
      },
    );

    // Below the depth limit the next generation is reached through the array "add"
    // affordance (nextArrayPath), never through linear navigation.
    it.each(siblingDepths.filter((d) => d < MAX_SUPPORTED_DESCENDANT_DEPTH))(
      "exposes the depth-%i descendant entry point while linear navigation returns to the summary",
      (depth) => {
        const leaf = { ...deceased, hatteKinder: "yes", kinder: [living] };
        const session = sessionAt(depth, "hatte-kinder", leaf);

        expect(session.nextArrayPath).toBe(pathAt(depth + 1, "name"));
        expect(session.nextPath).toBe("/angehoerige/elternteile/uebersicht");
      },
    );

    it("leaves the elternteil flow at the deepest supported generation instead of adding another level", () => {
      const leaf = { ...deceased, hatteKinder: "yes" };
      const session = sessionAt(
        MAX_SUPPORTED_DESCENDANT_DEPTH,
        "hatte-kinder",
        leaf,
      );

      expect(session.nextPath).toBe("/angehoerige/uebersicht");
    });
  });
});
