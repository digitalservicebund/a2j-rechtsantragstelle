import { FlowTestCases } from "~/domains/__test__/TestCases";
import { GeldEinklagenAnwaltschaftUserData } from "../../userData";

export const hauptUndNebenantraegeTestCases =
  {} satisfies FlowTestCases<
    Omit<GeldEinklagenAnwaltschaftUserData, "sonstigeNebenUndProzessantraege">
  >;
