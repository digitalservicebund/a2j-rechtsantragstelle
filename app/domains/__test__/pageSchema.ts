import { testCasesBeratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck/__test__/testcases";
import { testCasesKontopfaendungWegweiser } from "../kontopfaendung/wegweiser/__test__/testcases";
import { getPageSchema } from "../pageSchemas";
import type { SchemaObject, UserData } from "../userData";

const allTestCases = {
  "/beratungshilfe/vorabcheck": testCasesBeratungshilfeVorabcheck.cases,
  "/kontopfaendung/wegweiser": testCasesKontopfaendungWegweiser.cases,
};

Object.entries(allTestCases).forEach(([flowId, cases]) => {
  describe(`${flowId} pageSchemas`, () => {
    cases.forEach(([userData, stepIds], idx) =>
      verifyPageSchemas(flowId, stepIds, userData, idx),
    );
  });
});

function verifyPageSchemas(
  flowId: string,
  stepIds: readonly string[],
  userData: UserData,
  idx: number,
) {
  const pageSchemas = stepIds
    .slice(0, -1)
    .map((stepId) => getPageSchema(flowId + stepId))
    .filter(Boolean) as unknown as SchemaObject[];

  const userDataKeys = Object.keys(userData);
  const fieldnames = pageSchemas.flatMap((schema) => Object.keys(schema));

  it(`${idx}: all pageSchema fields are included in given userData`, () => {
    fieldnames.forEach((fieldname) =>
      expect(userDataKeys).to.include(fieldname),
    );
  });
}
