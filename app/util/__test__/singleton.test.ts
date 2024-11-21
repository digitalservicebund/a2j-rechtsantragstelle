import { singleton } from "../singleton.server";

describe("singleton", () => {
  test("refers to the same object after repeated calls", () => {
    const createFunc = () => ({ a: 1 });
    const firstObj = singleton("test", createFunc);
    const secondObj = singleton("test", createFunc);
    expect(firstObj).toBe(secondObj);
    expect(firstObj).not.toBe({ a: 1 });
  });

  test("doesn't refer to an identical object", () => {
    const firstObj = singleton("test", () => ({ a: 1 }));
    expect(firstObj).not.toBe({ a: 1 });
  });
});
