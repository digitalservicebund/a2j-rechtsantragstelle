import { addLeadingSlashToPageSchemas } from "../addLeadingSlashToPageConfig";

describe("addLeadingSlashToPageSchemas", () => {
  it("should add leading slash to stepId if it does not have one", () => {
    const pageConfig = {
      step1: { stepId: "step1", pageSchema: {} },
      step2: { stepId: "/step2", pageSchema: {} },
    };

    const result = addLeadingSlashToPageSchemas(pageConfig);

    expect(result).toEqual({
      step1: { stepId: "/step1", pageSchema: {} },
      step2: { stepId: "/step2", pageSchema: {} },
    });
  });

  it("should not modify stepId if it already has a leading slash", () => {
    const pageConfig = {
      step1: { stepId: "/step1", pageSchema: {} },
      step2: { stepId: "/step2", pageSchema: {} },
    };

    const result = addLeadingSlashToPageSchemas(pageConfig);

    expect(result).toEqual({
      step1: { stepId: "/step1", pageSchema: {} },
      step2: { stepId: "/step2", pageSchema: {} },
    });
  });

  it("should handle empty pageConfig", () => {
    const pageConfig = {};

    const result = addLeadingSlashToPageSchemas(pageConfig);

    expect(result).toEqual({});
  });
});
