import { renderHook } from "@testing-library/react";
import { type KlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { useKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/useKlageParties";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

const naturalPerson = {
  type: "natuerliche-person",
  index: 1,
} as unknown as KlageParteien[number];

const organization = {
  type: "organisation",
  index: 2,
} as unknown as KlageParteien[number];

describe("useKlageParteien", () => {
  it("returns the selected relationship grouped by party type and the next index", () => {
    const userData = {
      klagenden: [naturalPerson, organization],
    } as unknown as GeldEinklagenAnwaltschaftUserData;

    const { result } = renderHook(() =>
      useKlageParties({ relationship: "klagende", userData }),
    );

    expect(result.current).toEqual({
      klageParteienWithIndex: [
        { partei: naturalPerson, arrayIndex: 0, displayIndex: 0 },
        { partei: organization, arrayIndex: 1, displayIndex: 1 },
      ],
      nextItemIndex: 2,
    });
  });

  it("numbers natural persons before organizations without changing array indexes", () => {
    const userData = {
      klagenden: [organization, naturalPerson, organization, naturalPerson],
    } as unknown as GeldEinklagenAnwaltschaftUserData;

    const { result } = renderHook(() =>
      useKlageParties({ relationship: "klagende", userData }),
    );

    expect(
      result.current.klageParteienWithIndex.map(
        ({ arrayIndex, displayIndex }) => ({ arrayIndex, displayIndex }),
      ),
    ).toEqual([
      { arrayIndex: 0, displayIndex: 2 },
      { arrayIndex: 1, displayIndex: 0 },
      { arrayIndex: 2, displayIndex: 3 },
      { arrayIndex: 3, displayIndex: 1 },
    ]);
  });

  it("returns empty lists and index zero when the selected relationship is missing", () => {
    const userData = {
      klagenden: [naturalPerson],
    } as unknown as GeldEinklagenAnwaltschaftUserData;

    const { result } = renderHook(() =>
      useKlageParties({ relationship: "beklagte", userData }),
    );

    expect(result.current).toEqual({
      klageParteienWithIndex: [],
      nextItemIndex: 0,
    });
  });
});
