import { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getMaritalDescriptionByContext } from "~/services/pdf/beratungshilfe/sections/header";

describe("getMaritalDescriptionByContext", () => {
  it("should return `verheiratet/ in eingetragener Lebenspartnerschaft` when partnerschaft is `yes`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expectec = "verheiratet/ in eingetragener Lebenspartnerschaft";

    expect(expectec).toBe(actual);
  });
  it("should return `ledig` when partnerschaft is `no`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expectec = "ledig";

    expect(expectec).toBe(actual);
  });

  it("should return `verwitwet` when partnerschaft is `widowed`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "widowed",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expectec = "verwitwet";

    expect(expectec).toBe(actual);
  });

  it("should return `getrennt` when partnerschaft is `separated`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "separated",
    };

    const actual = getMaritalDescriptionByContext(context);
    const expectec = "getrennt";

    expect(expectec).toBe(actual);
  });

  it("should return `` when partnerschaft is `undefined`", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: undefined,
    };

    const actual = getMaritalDescriptionByContext(context);
    const expectec = "";

    expect(expectec).toBe(actual);
  });
});
