import { createSession, type Session } from "react-router";
import { type GeldEinklagenFormularUserData } from "../../formular/userData";
import {
  prefillZipCodeAndCity,
  updateIfUserNotPrefilledBeklagte,
  updateIfUserNotPrefilledKlagendePerson,
} from "../prefillZipCodeAndCity";
import { shouldVisitGerichtSuchenPostleitzahlKlagendePerson } from "../../formular/gericht-pruefen/gericht-suchen/guards";
import { updateSession } from "~/services/session.server";
import { getCityNameByZipCode } from "~/services/streetNames";

vi.mock(
  "~/domains/geldEinklagen/formular/gericht-pruefen/gericht-suchen/guards",
);

vi.mock("~/services/streetNames");
vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

vi.mocked(getCityNameByZipCode).mockReturnValue("Berlin");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("prefillZipCodeAndCity", () => {
  describe("klagende person", () => {
    it("should prefill the zip code and city if the user entered the postleitzahlSecondary", async () => {
      const userData = {
        postleitzahlSecondary: "10115",
        klagendePersonPlz: "",
        klagendePersonOrt: "",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      vi.mocked(
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
      ).mockReturnValue(true);

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          klagendePersonPlz: "10115",
          klagendePersonOrt: "Berlin",
          klagendePersonStatePrefilled: "prefilled",
        }),
      );
    });

    it("should prefill and not call again getCityNameByZipCode if the postleitzahlSecondary is equal the klagendePersonOrt", async () => {
      const userData = {
        postleitzahlSecondary: "10115",
        klagendePersonPlz: "10115",
        klagendePersonOrt: "Berlin",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      vi.mocked(
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
      ).mockReturnValue(true);

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          klagendePersonPlz: "10115",
          klagendePersonOrt: "Berlin",
          klagendePersonStatePrefilled: "prefilled",
        }),
      );

      expect(getCityNameByZipCode).not.toHaveBeenCalled();
    });

    it("should not update zip code and city in case they were updated by the user", async () => {
      const userData = {
        klagendePersonPlz: "somevalue",
        klagendePersonOrt: "somevalue",
        klagendePersonStatePrefilled: "filledByUser",
        postleitzahlSecondary: "10115",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      vi.mocked(
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
      ).mockReturnValue(false);

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          klagendePersonPlz: "somevalue",
          klagendePersonOrt: "somevalue",
          klagendePersonStatePrefilled: "filledByUser",
        }),
      );
    });

    it("should update as unfilled in case prefilled state is undefined and if the user is not eligible to enter the zip code for in the gericht suchen", async () => {
      const userData = {
        klagendePersonPlz: "somevalue",
        klagendePersonOrt: "somevalue",
        klagendePersonStatePrefilled: undefined,
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      vi.mocked(
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
      ).mockReturnValue(false);

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          klagendePersonPlz: "",
          klagendePersonOrt: "",
          klagendePersonStatePrefilled: "unfilled",
        }),
      );
    });
  });

  describe("beklagte data", () => {
    it("should prefill the zip code and city if the user entered the postleitzahlBeklagtePerson", async () => {
      const userData = {
        postleitzahlBeklagtePerson: "10115",
        beklagtePlz: "",
        beklagteOrt: "",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          beklagtePlz: "10115",
          beklagteOrt: "Berlin",
          beklagteStatePrefilled: "prefilled",
        }),
      );
    });

    it("should prefill and not call again getCityNameByZipCode if the postleitzahlBeklagtePerson is equal the beklagteOrt", async () => {
      const userData = {
        postleitzahlBeklagtePerson: "10115",
        beklagtePlz: "10115",
        beklagteOrt: "Berlin",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          beklagtePlz: "10115",
          beklagteOrt: "Berlin",
          beklagteStatePrefilled: "prefilled",
        }),
      );

      expect(getCityNameByZipCode).not.toHaveBeenCalled();
    });

    it("should not update zip code and city in case they were updated by the user", async () => {
      const userData = {
        beklagtePlz: "somevalue",
        beklagteOrt: "somevalue",
        beklagteStatePrefilled: "filledByUser",
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      vi.mocked(
        shouldVisitGerichtSuchenPostleitzahlKlagendePerson,
      ).mockReturnValue(false);

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          beklagtePlz: "somevalue",
          beklagteOrt: "somevalue",
          beklagteStatePrefilled: "filledByUser",
        }),
      );
    });

    it("should update as unfilled in case prefilled state is undefined and if the did not enter the postleitzahlBeklagtePerson", async () => {
      const userData = {
        beklagtePlz: "somevalue",
        beklagteOrt: "somevalue",
        beklagteStatePrefilled: undefined,
      } as GeldEinklagenFormularUserData;

      const mockSession: Session = createSession();

      await prefillZipCodeAndCity({} as Request, userData, mockSession);

      expect(updateSession).toHaveBeenCalledWith(
        mockSession,
        expect.objectContaining({
          beklagtePlz: "",
          beklagteOrt: "",
          beklagteStatePrefilled: "unfilled",
        }),
      );
    });
  });
});

describe("updateIfUserNotPrefilledBeklagte", () => {
  it("should not update the state if the beklagteStatePrefilled is prefilled", async () => {
    const userData = {
      beklagteStatePrefilled: "prefilled",
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateIfUserNotPrefilledBeklagte(
      {} as Request,
      userData,
      mockSession,
    );

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should update the state to filledByUser if the beklagteStatePrefilled is not prefilled", async () => {
    const userData = {
      beklagteStatePrefilled: "unfilled",
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateIfUserNotPrefilledBeklagte(
      {} as Request,
      userData,
      mockSession,
    );

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        beklagteStatePrefilled: "filledByUser",
      }),
    );
  });
});

describe("updateIfUserNotPrefilledKlagendePerson", () => {
  it("should not update the state if the klagendePersonStatePrefilled is prefilled", async () => {
    const userData = {
      klagendePersonStatePrefilled: "prefilled",
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateIfUserNotPrefilledKlagendePerson(
      {} as Request,
      userData,
      mockSession,
    );

    expect(updateSession).not.toHaveBeenCalled();
  });

  it("should update the state to filledByUser if the klagendePersonStatePrefilled is not prefilled", async () => {
    const userData = {
      klagendePersonStatePrefilled: "unfilled",
    } as GeldEinklagenFormularUserData;

    const mockSession: Session = createSession();

    await updateIfUserNotPrefilledKlagendePerson(
      {} as Request,
      userData,
      mockSession,
    );

    expect(updateSession).toHaveBeenCalledWith(
      mockSession,
      expect.objectContaining({
        klagendePersonStatePrefilled: "filledByUser",
      }),
    );
  });
});
