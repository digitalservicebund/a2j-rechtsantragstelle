import { renderHook } from "@testing-library/react";
import { useProzessbevollmaechtigte } from "../useProzessbevollmaechtigte";
import { getProzessbevollmaechtigteArrayName } from "../prozessbevollmaechtigteHelpers";
import { type GeldEinklagenAnwaltschaftUserData } from "../../../../userData";
import { einzelkanzlei, gesellschaft, unrelatedParty } from "./fixtures";

describe("useProzessbevollmaechtigte", () => {
  it.each(["klagende", "beklagte"] as const)(
    "selects only %s representatives and numbers Einzelkanzleien first",
    (relationship) => {
      const userData: GeldEinklagenAnwaltschaftUserData = {
        [getProzessbevollmaechtigteArrayName(relationship)]: [
          gesellschaft,
          einzelkanzlei,
          gesellschaft,
          einzelkanzlei,
        ],
        klagenden: [unrelatedParty],
        beklagten: [unrelatedParty],
      };
      const { result, rerender } = renderHook(
        ({ userData }: { userData: GeldEinklagenAnwaltschaftUserData }) =>
          useProzessbevollmaechtigte({ relationship, userData }),
        {
          initialProps: { userData },
        },
      );
      expect(result.current).toEqual([
        {
          prozessbevollmaechtigte: gesellschaft,
          arrayIndex: 0,
        },
        {
          prozessbevollmaechtigte: einzelkanzlei,
          arrayIndex: 1,
        },
        {
          prozessbevollmaechtigte: gesellschaft,
          arrayIndex: 2,
        },
        {
          prozessbevollmaechtigte: einzelkanzlei,
          arrayIndex: 3,
        },
      ]);

      rerender({ userData: {} });
      expect(result.current).toEqual([]);
    },
  );
});
