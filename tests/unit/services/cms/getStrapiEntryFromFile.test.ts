import { StrapiFileContentSchema } from "~/services/cms/models/StrapiFileContent";
import type { GetStrapiEntryOpts } from "~/services/cms";
import { getStrapiEntryFromFile } from "~/services/cms/getStrapiEntryFromFile";

jest.mock("~/services/cms/models/StrapiFileContent", () => {
  return {
    __esModule: true,
    StrapiFileContentSchema: {
      parse: jest.fn(),
    },
  };
});

const mockedStrapiFileContentSchema = StrapiFileContentSchema as jest.Mocked<
  typeof StrapiFileContentSchema
>;

describe("services/cms", () => {
  describe("getStrapiEntryFromFile", () => {
    const defaultOptions: GetStrapiEntryOpts = {
      apiId: "footer",
      locale: "de",
    };

    test("returns an entry", async () => {
      const data = { attributes: { locale: "de" } };
      // TODO: return full footer object and remove ts-ignore
      //@ts-ignore
      mockedStrapiFileContentSchema.parse.mockReturnValue({ footer: [data] });
      expect(await getStrapiEntryFromFile(defaultOptions)).toEqual(data);
    });

    describe("when no entry exists for the given locale", () => {
      it("returns undefined", async () => {
        const data = { attributes: { locale: "de" } };
        // TODO: return full footer object and remove ts-ignore
        //@ts-ignore
        mockedStrapiFileContentSchema.parse.mockReturnValue({ footer: [data] });
        expect(
          await getStrapiEntryFromFile({ ...defaultOptions, locale: "en" })
        ).toBeUndefined();
      });
    });

    describe("with a slug given", () => {
      it("returns an entry", async () => {
        const data = { attributes: { slug: "impressum", locale: "de" } };
        // TODO: return full page object and remove ts-ignore
        //@ts-ignore
        mockedStrapiFileContentSchema.parse.mockReturnValue({ pages: [data] });
        expect(
          await getStrapiEntryFromFile({
            ...defaultOptions,
            apiId: "pages",
            slug: "impressum",
          })
        ).toEqual(data);
      });

      describe("when no entry exists for the given slug", () => {
        it("returns undefined", async () => {
          const data = { attributes: { slug: "impressum", locale: "de" } };
          mockedStrapiFileContentSchema.parse.mockReturnValue({
            // TODO: return full page object and remove ts-ignore
            //@ts-ignore
            pages: [data],
          });
          expect(
            await getStrapiEntryFromFile({
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
