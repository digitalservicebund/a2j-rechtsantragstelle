import z from "zod";
import {
  compileFlow,
  type CompiledFlow,
} from "../../newFlowEngine/compileFlow";
import { type PageConfigMap } from "../../newFlowEngine/types";
import { generateUserDataToSave } from "../generateUserDataToSave";

const flowId = "/beratungshilfe/antrag";
const pages = {
  start: { stepId: "/step1/start", schema: { name: z.string() } },
  middle: { stepId: "/step1/middle", schema: { age: z.number() } },
  end: { stepId: "/step1/end" },
} as const;

const transitions = {
  start: "middle",
  middle: "end",
  end: null,
} as const;

const compiledFlow = compileFlow({
  pages,
  initialStep: "start",
  transitions,
}) as CompiledFlow<PageConfigMap>;

describe("generateUserDataToSave", () => {
  it("should merge sessionUserData, formUserData and add subflowDoneStates to pageData", () => {
    const sessionUserData = {
      name: "John",
    };

    const formUserData = {
      age: 30,
    };

    const result = generateUserDataToSave(
      "/step1/middle",
      { sessionUserData, formUserData, migrationData: {} },
      flowId,
      compiledFlow,
    );

    expect(result).toEqual({
      name: "John",
      age: 30,
      pageData: {
        subflowDoneStates: {
          "/step1": true,
        },
      },
    });
  });

  it("should return migration data together with sessionUserData", () => {
    const sessionUserData = {
      name: "John",
      age: 30,
    };

    const migrationData = {
      migratedField: "migratedValue",
    };

    const result = generateUserDataToSave(
      "/step1/end",
      { sessionUserData, formUserData: {}, migrationData },
      flowId,
      compiledFlow,
    );

    expect(result).toMatchObject({
      migratedField: "migratedValue",
    });
  });
});
