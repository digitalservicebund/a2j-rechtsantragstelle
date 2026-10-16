import { renderHook } from "@testing-library/react";
import { type KlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { useKlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/useKlageParteien";
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
      useKlageParteien({ relationship: "klagende", userData }),
    );

    expect(result.current).toEqual({
      klageParteien: {
        naturalPersonen: [naturalPerson],
        organizations: [organization],
      },
      nextItemIndex: 2,
    });
  });

  it("returns empty lists and index zero when the selected relationship is missing", () => {
    const userData = {
      klagenden: [naturalPerson],
    } as unknown as GeldEinklagenAnwaltschaftUserData;

    const { result } = renderHook(() =>
      useKlageParteien({ relationship: "beklagte", userData }),
    );

    expect(result.current).toEqual({
      klageParteien: {
        naturalPersonen: [],
        organizations: [],
      },
      nextItemIndex: 0,
    });
  });
});
