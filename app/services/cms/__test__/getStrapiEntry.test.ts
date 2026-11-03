import { getStrapiEntry } from "../getStrapiEntry";
import { getStrapiEntryFromApi } from "../getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "../getStrapiEntryFromFile";
import type { GetStrapiEntryOpts, StrapiSchemas } from "../schemas";

vi.mock("~/services/cms/getStrapiEntryFromFile");
vi.mock("~/services/cms/getStrapiEntryFromApi");

afterEach(() => {
  vi.unstubAllEnvs();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const mockedTranslations = (
  translations?: StrapiSchemas["translations"],
): StrapiSchemas["translations"] => {
  if (translations) return translations;

  return [
    {
      scope: "amtsgericht",
      locale: "de",
      field: [{ name: "amtsgerichtKey", value: "amtsgerichtValueDE" }],
    },
    {
      scope: "amtsgericht",
      locale: "en",
      field: [{ name: "amtsgerichtKey", value: "amtsgerichtValueEN" }],
    },
  ];
};

describe("getStrapiEntry", () => {
  it("should call getStrapiEntryFromFile when CMS env is File", async () => {
    vi.stubEnv("CMS", "FILE");
    vi.stubEnv("ENVIRONMENT", "development");

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(mockedTranslations());
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(mockedTranslations());

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
    };

    await getStrapiEntry(defaultOptions);

    expect(getStrapiEntryFromFile).toHaveBeenCalled();
    expect(getStrapiEntryFromApi).not.toHaveBeenCalled();
  });

  it("should call getStrapiEntryFromFile when environment is production", async () => {
    vi.stubEnv("CMS", "STRAPI");
    vi.stubEnv("ENVIRONMENT", "production");

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(mockedTranslations());
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(mockedTranslations());

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
    };

    await getStrapiEntry(defaultOptions);

    expect(getStrapiEntryFromFile).toHaveBeenCalled();
    expect(getStrapiEntryFromApi).not.toHaveBeenCalled();
  });

  it("should call getStrapiEntryFromApi with the correct parameters when CMS is Strapi and environment is not production", async () => {
    vi.stubEnv("CMS", "STRAPI");
    vi.stubEnv("ENVIRONMENT", "development");

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(mockedTranslations());
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(mockedTranslations());

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
    };

    await getStrapiEntry(defaultOptions);

    expect(getStrapiEntryFromApi).toHaveBeenCalled();
    expect(getStrapiEntryFromApi).toHaveBeenCalledWith({
      ...defaultOptions,
      showDraftVersion: true,
    });
    expect(getStrapiEntryFromFile).not.toHaveBeenCalled();
  });

  it("should return the locale for the opt.locale", async () => {
    vi.stubEnv("CMS", "STRAPI");
    vi.stubEnv("ENVIRONMENT", "development");

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(mockedTranslations());
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(mockedTranslations());

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
      locale: "en",
    };

    const entries = await getStrapiEntry(defaultOptions);
    expect(entries).toEqual([
      {
        scope: "amtsgericht",
        locale: "en",
        field: [{ name: "amtsgerichtKey", value: "amtsgerichtValueEN" }],
      },
    ]);
  });

  it("should return the default locale in case opt.locale is not set", async () => {
    vi.stubEnv("CMS", "STRAPI");
    vi.stubEnv("ENVIRONMENT", "development");

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(mockedTranslations());
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(mockedTranslations());

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
    };

    const entries = await getStrapiEntry(defaultOptions);
    expect(entries).toEqual([
      {
        scope: "amtsgericht",
        locale: "de",
        field: [{ name: "amtsgerichtKey", value: "amtsgerichtValueDE" }],
      },
    ]);
  });

  it("should return all the entries in case opt.locale does not exist", async () => {
    vi.stubEnv("CMS", "STRAPI");
    vi.stubEnv("ENVIRONMENT", "development");

    const otherEntries: StrapiSchemas["translations"] = [
      {
        scope: "amtsgericht",
        locale: "de",
        field: [{ name: "amtsgerichtKey", value: "anotherTranslations" }],
      },
    ];

    vi.mocked(getStrapiEntryFromFile).mockResolvedValue(
      mockedTranslations(otherEntries),
    );
    vi.mocked(getStrapiEntryFromApi).mockResolvedValue(
      mockedTranslations(otherEntries),
    );

    const defaultOptions: GetStrapiEntryOpts<"translations"> = {
      apiId: "translations",
      pLevel: 5,
      locale: "en",
    };

    const entries = await getStrapiEntry(defaultOptions);
    expect(entries).toEqual(otherEntries);
  });
});
