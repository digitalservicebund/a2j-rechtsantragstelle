import { createSession, type Session } from "react-router";
import { updateSession } from "~/services/session.server";
import { type GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { updatePartei } from "../updateKlagendePartei";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updatePartei", () => {
  it("should set the claimant type and one-based index from the request URL", async () => {
    const userData = {
      otherData: "preserved",
      klagenden: [
        { name: "Erika Musterfrau", type: "juristische-person", index: 99 },
        { name: "Max Mustermann", type: "juristische-person", index: 99 },
      ],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    await updatePartei("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag/2"),
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
            type: "natuerliche-person",
            index: 3,
          },
          {
            name: "Max Mustermann",
            type: "natuerliche-person",
            index: 3,
          },
        ],
      }),
    );
  });

  it("should default to index 1 when the request URL has no array index", async () => {
    const userData = {
      klagenden: [{ name: "Erika Musterfrau" }],
    } as unknown as GeldEinklagenAnwaltschaftUserData;
    const mockSession: Session = createSession();

    await updatePartei("klagende", "natuerliche-person")(
      new Request("http://localhost/antrag"),
      userData,
      mockSession,
    );

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        klagenden: [
          {
            name: "Erika Musterfrau",
            type: "natuerliche-person",
            index: 1,
          },
        ],
      }),
    );
  });
});
