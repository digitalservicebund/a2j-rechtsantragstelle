import { describe, it, expect } from "vitest";
import { composePageTitle } from "../composePageTitle";
import type { FlowId } from "~/domains/flowIds";

describe("composePageTitle", () => {
  it("returns pageTitle and parent title separated by a dash when parent meta has a title", async () => {
    const flowName = "Antrag";
    const serviceName = "Beratungshilfe: So funktioniert's | Justiz-Services"; // remove " | Justiz-Services" when Strapi entry is renamed
    const flowId: FlowId = "/beratungshilfe/antrag";
    const result = await composePageTitle("Child Page", flowId);
    expect(result).toEqual(
      `Child Page - ${flowName} - ${serviceName} | Justiz-Services`,
    );
  });
});
