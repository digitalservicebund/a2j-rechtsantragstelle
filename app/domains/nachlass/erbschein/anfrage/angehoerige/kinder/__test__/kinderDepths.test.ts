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

const depths = [1, 2, 3, 4, 5] as const;

// "/angehoerige/kinder/#/kinder/#/lebend" for depth 2.
const pathAt = (depth: number, page: string) =>
  `/angehoerige${"/kinder/#".repeat(depth)}/${page}`;

// Nests `leaf` under `depth - 1` deceased ancestors that each said hatteKinder=yes.
const treeTo = (depth: number, leaf: object): object => {
  let node = leaf;
  for (let level = depth; level > 1; level--) {
    node = { ...deceased, hatteKinder: "yes", kinder: [node] };
  }
  return { ...happyPathData, hatteKinder: "yes", kinder: [node] };
};

const sessionAt = (depth: number, page: string, leaf: object) =>
  createFlowSession(
    nachlassErbscheinAnfrageFlowConfig,
    {
      ...treeTo(depth, leaf),
      pageData: { arrayIndexes: Array(depth).fill(0) },
    } as UserData,
    pathAt(depth, page),
  );

describe("kinder navigation at every supported depth", () => {
  it.each(depths)(
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

  it.each(depths)(
    "routes a living kind at depth %i to its address, then back to the summary",
    (depth) => {
      expect(sessionAt(depth, "lebend", living).nextPath).toBe(
        pathAt(depth, "adresse"),
      );
      expect(sessionAt(depth, "adresse", living).nextPath).toBe(
        "/angehoerige/kinder/uebersicht",
      );
    },
  );

  it.each(depths)(
    "routes a deceased kind at depth %i to its death date, then to hatte-kinder",
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

  it.each(depths)(
    "returns to the summary when a deceased kind at depth %i had no children",
    (depth) => {
      const leaf = { ...deceased, hatteKinder: "no" };
      expect(sessionAt(depth, "hatte-kinder", leaf).nextPath).toBe(
        "/angehoerige/kinder/uebersicht",
      );
    },
  );

  // Below the depth limit the next generation is reached through the array "add"
  // affordance (nextArrayPath), never through linear navigation.
  it.each(depths.filter((d) => d < MAX_SUPPORTED_DESCENDANT_DEPTH))(
    "exposes the depth-%i descendant entry point while linear navigation returns to the summary",
    (depth) => {
      const leaf = { ...deceased, hatteKinder: "yes", kinder: [living] };
      const session = sessionAt(depth, "hatte-kinder", leaf);

      expect(session.nextArrayPath).toBe(pathAt(depth + 1, "name"));
      expect(session.nextPath).toBe("/angehoerige/kinder/uebersicht");
    },
  );

  it("leaves the kinder flow at the deepest supported generation instead of adding another level", () => {
    const leaf = { ...deceased, hatteKinder: "yes" };
    const session = sessionAt(
      MAX_SUPPORTED_DESCENDANT_DEPTH,
      "hatte-kinder",
      leaf,
    );

    expect(session.nextPath).toBe("/angehoerige/uebersicht");
  });
});
