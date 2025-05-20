import { vi, type Mock } from "vitest";
import { usePosthogWithConsent } from "~/components/cookieBanner/usePosthogWithConsent";
import { useSurvey } from "../useSurvey";

vi.mock("~/components/cookieBanner/usePosthogWithConsent", () => ({
  usePosthogWithConsent: vi.fn(),
}));

const FEEDBACK_SURVEY_ID = "01956b7e-2774-0000-49d7-d34d26811373";

describe("useSurvey", () => {
  let mockUsePosthogWithConsent: Mock;

  beforeEach(() => {
    mockUsePosthogWithConsent = usePosthogWithConsent as Mock;
    vi.clearAllMocks();
  });

  it("should return null if posthog is null and hasTrackingConsent is false", async () => {
    mockUsePosthogWithConsent.mockReturnValue({
      posthog: null,
      hasTrackingConsent: false,
    });
    const { fetchSurvey } = useSurvey();
    const result = await fetchSurvey();
    expect(result).toBeNull();
  });

  it("should return null if posthog exists and hasTrackingConsent is false", async () => {
    mockUsePosthogWithConsent.mockReturnValue({
      posthog: { getSurveys: vi.fn() },
      hasTrackingConsent: false,
    });
    const { fetchSurvey } = useSurvey();
    const result = await fetchSurvey();
    expect(result).toBeNull();
  });

  it("should return the survey if posthog exists, hasTrackingConsent is true and survey is found", async () => {
    const survey = { id: FEEDBACK_SURVEY_ID, name: "Test Survey" };
    const getSurveys = vi.fn((cb) => cb([survey]));
    mockUsePosthogWithConsent.mockReturnValue({
      posthog: { getSurveys },
      hasTrackingConsent: true,
    });
    const { fetchSurvey } = useSurvey();
    const result = await fetchSurvey();
    expect(result).toEqual(survey);
    expect(getSurveys).toHaveBeenCalled();
  });

  it("should return null if posthog exists, hasTrackingConsent is true but survey is not found", async () => {
    const getSurveys = vi.fn((cb) =>
      cb([{ id: "other-id", name: "Other Survey" }]),
    );
    mockUsePosthogWithConsent.mockReturnValue({
      posthog: { getSurveys },
      hasTrackingConsent: true,
    });
    const { fetchSurvey } = useSurvey();
    const result = await fetchSurvey();
    expect(result).toBeNull();
    expect(getSurveys).toHaveBeenCalled();
  });
});
