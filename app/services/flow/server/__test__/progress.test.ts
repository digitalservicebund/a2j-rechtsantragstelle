import { createMachine } from "xstate";
import { progressLookup, progressLookupForMachine } from "../progress";
import { xstateMockConfig } from "./buildFlowController.test";

describe("progressLookup", () => {
  it("returns 5/5", () => {
    const machine = createMachine({
      ...xstateMockConfig,
      context: { step1: true },
    });
    const stepProgress = progressLookup(
      progressLookupForMachine(machine),
      "/step4/step2",
    );
    expect(stepProgress).toStrictEqual({ progress: 5, max: 5 });
  });

  it("returns 3/5", () => {
    const machine = createMachine({
      ...xstateMockConfig,
      context: { step1: true },
    });
    const stepProgress = progressLookup(
      progressLookupForMachine(machine),
      "/step3",
    );
    expect(stepProgress).toStrictEqual({
      progress: 3,
      max: 5,
    });
  });

  it("returns 1/5", () => {
    const machine = createMachine({ ...xstateMockConfig });
    const stepProgress = progressLookup(
      progressLookupForMachine(machine),
      "/step1",
    );
    expect(stepProgress).toStrictEqual({
      progress: 1,
      max: 5,
    });
  });

  it("returns 2/5 even if data doesn't fit", () => {
    const machine = createMachine({
      ...xstateMockConfig,
      context: { step1: false },
    });
    const stepProgress = progressLookup(
      progressLookupForMachine(machine),
      "/step2",
    );
    expect(stepProgress).toStrictEqual({
      progress: 2,
      max: 5,
    });
  });
});
