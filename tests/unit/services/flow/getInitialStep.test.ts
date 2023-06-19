import { getInitialStep } from "~/services/flow/getInitialStep";

const flow = {
  id: "/flow/vorabcheck/",
  initial: "step1",
};

test("getInitialStep", () => {
  expect(getInitialStep({ flow })).toStrictEqual({
    name: "step1",
    url: "/flow/vorabcheck/step1",
  });
});
