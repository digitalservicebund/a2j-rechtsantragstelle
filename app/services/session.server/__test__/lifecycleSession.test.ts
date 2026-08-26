import { getLifecycleTimeBySessionUserData } from "../lifecycleSession";

describe("getLifecycleTimeBySessionUserData", () => {
  it("should return the default time to live for 'main' context", () => {
    const result = getLifecycleTimeBySessionUserData("main");
    expect(result).toBe(86400); // 24 hours in seconds
  });

  it("should return the lifecycle time for a specific flow context", () => {
    const result = getLifecycleTimeBySessionUserData(
      "/geld-einklagen/formular",
    );
    expect(result).toBe(2592000); // 720 hours in seconds
  });

  it("should return the default time to live for an unknown context", () => {
    const result = getLifecycleTimeBySessionUserData("unknown-context" as any);
    expect(result).toBe(86400); // 24 hours in seconds
  });
});
