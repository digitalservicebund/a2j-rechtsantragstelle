import { StrapiFileContentSchema } from "~/services/cms/models/StrapiFileContent";
import type { GetEntryOpts } from "~/services/cms";
import { getEntryFromFile } from "~/services/cms/file";

jest.mock("~/services/cms/models/FileContent", () => {
  return {
    __esModule: true,
    FileContentSchema: {
      parse: jest.fn(),
    },
  };
});

const mockedFileContentSchema = StrapiFileContentSchema as jest.Mocked<
  typeof StrapiFileContentSchema
>;

describe("services/cms/file", () => {
  describe("getEntryFromFile", () => {
    const defaultOptions: GetEntryOpts = { apiId: "footer", locale: "de" };

    test("returns an entry", async () => {
      const data = { attributes: { locale: "de" } };
      // TODO: return full footer object and remove ts-ignore
      //@ts-ignore
      mockedFileContentSchema.parse.mockReturnValue({ footer: [data] });
      expect(await getEntryFromFile(defaultOptions)).toEqual(data);
    });

    describe("when no entry exists for the given locale", () => {
      it("returns undefined", async () => {
        const data = { attributes: { locale: "de" } };
        // TODO: return full footer object and remove ts-ignore
        //@ts-ignore
        mockedFileContentSchema.parse.mockReturnValue({ footer: [data] });
        expect(
          await getEntryFromFile({ ...defaultOptions, locale: "en" })
        ).toBeUndefined();
      });
    });

    describe("with a slug given", () => {
      it("returns an entry", async () => {
        const data = { attributes: { slug: "impressum", locale: "de" } };
        // TODO: return full page object and remove ts-ignore
        //@ts-ignore
        mockedFileContentSchema.parse.mockReturnValue({ pages: [data] });
        expect(
          await getEntryFromFile({
            ...defaultOptions,
            apiId: "pages",
            slug: "impressum",
          })
        ).toEqual(data);
      });

      describe("when no entry exists for the given slug", () => {
        it("returns undefined", async () => {
          const data = { attributes: { slug: "impressum", locale: "de" } };
          // TODO: return full page object and remove ts-ignore
          //@ts-ignore
          mockedFileContentSchema.parse.mockReturnValue({ pages: [data] });
          expect(
            await getEntryFromFile({
              ...defaultOptions,
              apiId: "pages",
              slug: "datenschutz",
            })
          ).toBeUndefined();
        });
      });
    });
  });
});
