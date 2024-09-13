import { persoenlicheDatenTargetReplacements as BerHPersoenlicheDatenReplacements } from "~/flows/beratungshilfeFormular";
import { getPersoenlicheDatenSubflow } from "~/flows/shared/persoenlicheDaten";

describe("getPersoenlicheDatenSubflow", () => {
  describe("beratungshilfeFormular target replacements", () => {
    it.each(Object.entries(BerHPersoenlicheDatenReplacements))(
      "%s should be replaced by %s",
      (_targetName, desiredReplacement) => {
        const persoenlicheDatenSubflow = getPersoenlicheDatenSubflow(
          BerHPersoenlicheDatenReplacements,
        );
        expect(JSON.stringify(persoenlicheDatenSubflow)).toContain(
          desiredReplacement,
        );
      },
    );
  });
});
