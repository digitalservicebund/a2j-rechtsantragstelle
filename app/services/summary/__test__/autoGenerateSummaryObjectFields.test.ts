import { describe, it, expect, vi } from "vitest";
import { generateSummaryFromUserData } from "../autoGenerateSummary";
import type { UserData } from "~/domains/userData";
import type { FlowId } from "~/domains/flowIds";

vi.mock("~/services/cms/index.server", () => ({
  fetchFlowPage: vi.fn(),
}));

const { fetchFlowPage } = await import("~/services/cms/index.server");

const flowId: FlowId = "/prozesskostenhilfe/formular";
const objectFieldStepId = "/antragstellende-person/unterhaltspflichtige-person";

const objectFieldPage = {
  heading: "Von wem bekommen Sie den Unterhalt?",
  form: [
    {
      __component: "form-elements.select",
      name: "unterhaltspflichtigePerson.beziehung",
      label: "Beziehung",
      options: [
        { text: "Mutter", value: "mother" },
        { text: "Vater", value: "father" },
      ],
    },
    {
      __component: "form-elements.input",
      name: "unterhaltspflichtigePerson.vorname",
      label: "Vorname",
    },
    {
      __component: "form-elements.input",
      name: "unterhaltspflichtigePerson.nachname",
      label: "Nachname",
    },
  ],
};

const stepStates = [
  {
    stepId: "/antragstellende-person",
    isDone: true,
    isReachable: true,
    url: `${flowId}/antragstellende-person`,
  },
];

describe("generateSummaryFromUserData with plain object fields", () => {
  vi.mocked(fetchFlowPage).mockImplementation((_collection, _flowId, stepId) =>
    Promise.resolve(
      (stepId === objectFieldStepId
        ? objectFieldPage
        : { heading: "", form: [] }) as never,
    ),
  );

  const userData: UserData = {
    unterhaltspflichtigePerson: {
      beziehung: "mother",
      vorname: "Erika",
      nachname: "Musterfrau",
    },
  };

  it("renders each sub-field of a plain object as its own answered row", async () => {
    const summary = await generateSummaryFromUserData(
      userData,
      flowId,
      stepStates,
      {},
    );

    const rows = summary.flatMap((section) =>
      section.fields.map(({ question, answer, editUrl }) => ({
        question,
        answer,
        editUrl,
      })),
    );

    expect(rows).toEqual([
      {
        question: "Beziehung",
        answer: "Mutter",
        editUrl: `${flowId}${objectFieldStepId}`,
      },
      {
        question: "Vorname",
        answer: "Erika",
        editUrl: `${flowId}${objectFieldStepId}`,
      },
      {
        question: "Nachname",
        answer: "Musterfrau",
        editUrl: `${flowId}${objectFieldStepId}`,
      },
    ]);
  });

  it("links each sub-field to its own page when an object is split across pages", async () => {
    const summary = await generateSummaryFromUserData(
      {
        child: {
          vorname: "Max",
          nachname: "Muster",
          geburtsdatum: "01.01.2015",
        },
      },
      flowId,
      stepStates,
      {},
    );

    const editUrlByAnswer = Object.fromEntries(
      summary.flatMap((section) =>
        section.fields.map(({ answer, editUrl }) => [answer, editUrl]),
      ),
    );

    const veStepId = `${flowId}/antragstellende-person/vereinfachte-erklaerung`;
    expect(editUrlByAnswer).toEqual({
      Max: `${veStepId}/kind`,
      Muster: `${veStepId}/kind`,
      "01.01.2015": `${veStepId}/geburtsdatum`,
    });
  });
});
