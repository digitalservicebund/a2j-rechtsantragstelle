import { createSession, type Session } from "react-router";
import { updateSession } from "~/services/session.server";
import { type GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { setParteiType } from "../setParteiType";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("setParteiType", () => {
  it("should set the claimant type and one-based index from the request URL", async () => {
    const userData = {
      otherData: "preserved",
      klagenden: [
        { name: "Erika Musterfrau", type: "juristische-person" },
        { name: "Max Mustermann", type: "juristische-person" },
      ],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    await setParteiType("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag/1"),
      userData,
      mockSession,
    );

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        otherData: "preserved",
        klagenden: [
          {
            name: "Erika Musterfrau",
            type: "juristische-person",
          },
          {
            name: "Max Mustermann",
            type: "natuerliche-person",
          },
        ],
      }),
    );
  });

  it("should return early when the request URL has no array index", async () => {
    const userData = {
      klagenden: [{ name: "Erika Musterfrau" }],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    await setParteiType("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag"),
      userData,
      mockSession,
    );

    expect(updateSession).not.toHaveBeenCalled();
  });
});
