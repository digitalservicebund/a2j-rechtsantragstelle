// import { describe, it, expect, vi } from "vitest";
// import { generateSummaryFromUserData } from "../autoGenerateSummary";
// import type { UserData } from "~/domains/userData";
// import type { Translations } from "~/services/translations/getTranslationByKey";
// import type { FlowId } from "~/domains/flowIds";

// vi.mock("../getFormQuestions", () => ({
//   getFormQuestionsForFields: vi.fn(),
//   createFieldToStepMapping: vi.fn(),
// }));

// vi.mock("~/services/cms/fetchAllFormFields", () => ({
//   fetchAllFormFields: vi.fn(),
// }));

// const { getFormQuestionsForFields, createFieldToStepMapping } = await import(
//   "../getFormQuestions"
// );

// const { fetchAllFormFields } = await import(
//   "~/services/cms/fetchAllFormFields"
// );

// const mockGetFormQuestionsForFields = vi.mocked(getFormQuestionsForFields);
// const mockCreateFieldToStepMapping = vi.mocked(createFieldToStepMapping);
// const mockFetchAllFormFields = vi.mocked(fetchAllFormFields);

// describe.skip("generateSummaryFromUserData", () => {
//   const mockUserData: UserData = {
//     vorname: "Max",
//     nachname: "Mustermann",
//     geburtsdatum: "1990-01-15",
//     emptyField: "",
//   };

//   const mockFlowId: FlowId = "/beratungshilfe/antrag";

//   const mockTranslations: Translations = {
//     "fields.vorname": "Vorname",
//     "fields.nachname": "Nachname",
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();

//     mockFetchAllFormFields.mockResolvedValue({} as any);
//   });

//   it("should generate summary sections with form data", async () => {
//     mockGetFormQuestionsForFields.mockResolvedValue({
//       vorname: {
//         question: "Wie ist Ihr Vorname?",
//       },
//       nachname: {
//         question: "Wie ist Ihr Nachname?",
//       },
//       geburtsdatum: {
//         question: "Geburtsdatum",
//       },
//     });

//     mockCreateFieldToStepMapping.mockReturnValue({
//       vorname: "/persoenliche-daten/grunddaten",
//       nachname: "/persoenliche-daten/grunddaten",
//       geburtsdatum: "/persoenliche-daten/grunddaten",
//     });

//     // Create a mock flow controller
//     const mockFlowController = {
//       stepStates: () => [
//         {
//           stepId: "/persoenliche-daten",
//           subStates: [
//             {
//               stepId: "/persoenliche-daten/grunddaten",
//               subStates: [],
//             },
//           ],
//         },
//       ],
//     } as any;

//     const result = await generateSummaryFromUserData(
//       mockUserData,
//       mockFlowId,
//       mockTranslations,
//       mockFlowController,
//     );

//     expect(result).toHaveLength(1);
//     expect(result[0]).toMatchObject({
//       id: "persoenliche-daten",
//       title: "Persönliche Daten",
//       fields: expect.arrayContaining([
//         expect.objectContaining({
//           question: expect.any(String),
//           answer: expect.any(String),
//           editUrl: expect.any(String),
//         }),
//       ]),
//     });
//     expect(result[0].fields).toHaveLength(3); // vorname, nachname, geburtsdatum
//   });

//   it("should return empty array when no valid user data fields", async () => {
//     const emptyUserData: UserData = {
//       pageData: "some data", // This gets filtered out
//       emptyField: "", // This is empty
//     };

//     const result = await generateSummaryFromUserData(
//       emptyUserData,
//       mockFlowId,
//       mockTranslations,
//     );

//     expect(result).toHaveLength(0);
//   });

//   it("should call getFormQuestionsForFields with user data fields", async () => {
//     mockGetFormQuestionsForFields.mockResolvedValue({});
//     mockCreateFieldToStepMapping.mockReturnValue({});

//     await generateSummaryFromUserData(
//       mockUserData,
//       mockFlowId,
//       mockTranslations,
//     );

//     expect(mockGetFormQuestionsForFields).toHaveBeenCalledWith(
//       ["vorname", "nachname", "geburtsdatum", "emptyField"],
//       mockFlowId,
//     );
//   });
// });
