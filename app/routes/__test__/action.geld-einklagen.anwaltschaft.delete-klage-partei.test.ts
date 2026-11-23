import { createSession, type ActionFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import { action } from "../action.geld-einklagen.anwaltschaft.delete-klage-partei";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));

vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn(),
}));

describe("deleting a Klagepartei's connected Antraege", () => {
  beforeEach(() => {
    vi.mocked(validatedSession).mockResolvedValue(Result.ok());
  });

  it("finds a draft Hauptantrag by its array even when its amount is missing", async () => {
    const session = createSession({
      klagenden: [{ id: "deleted" }, { id: "remaining" }],
      hauptantrag: [
        {
          id: "draft",
          klagende: { deleted: "on", remaining: "on" },
          beklagte: { defendant: "on" },
        },
      ],
    });
    vi.mocked(getSessionManager).mockReturnValue({
      getSession: vi.fn().mockResolvedValue(session),
      commitSession: vi.fn().mockResolvedValue(new Headers()),
      destroySession: vi.fn(),
    });

    const formData = new FormData();
    formData.set(
      "pathnameArrayItem",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden",
    );
    formData.set("klagenden", "0");
    formData.set("_jsEnabled", "true");
    const response = await action({
      request: new Request(
        "http://localhost/action/geld-einklagen/anwaltschaft/delete-klage-partei",
        { method: "POST", body: formData },
      ),
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toBe(200);
    expect(session.data.hauptantrag).toEqual([
      {
        id: "draft",
        klagende: { remaining: "on" },
        beklagte: { defendant: "on" },
      },
    ]);
    expect(session.data.klagenden).toEqual([{ id: "remaining" }]);
  });

  it("deletes a klagende Partei's sole-party Antraege and updates its shared Antraege without changing unrelated items", async () => {
    const unrelatedHauptantrag = {
      id: "unrelated-hauptantrag",
      betragForderung: "200",
      klagende: { remainingClaimant: "on" },
      beklagte: { defendant: "on" },
    };
    const unrelatedSchmerzensgeldantrag = {
      id: "unrelated-schmerzensgeldantrag",
      klagende: { remainingClaimant: "on" },
      beklagte: { defendant: "on" },
    };
    const session = createSession({
      klagenden: [{ id: "deletedClaimant" }, { id: "remainingClaimant" }],
      hauptantrag: [
        {
          id: "sole-party-hauptantrag-1",
          betragForderung: "100",
          klagende: { deletedClaimant: "on" },
          beklagte: { defendant: "on" },
        },
        unrelatedHauptantrag,
        {
          id: "sole-party-hauptantrag-2",
          betragForderung: "300",
          klagende: { deletedClaimant: "on" },
          beklagte: { defendant: "on" },
        },
        {
          id: "shared-hauptantrag-1",
          betragForderung: "400",
          klagende: { deletedClaimant: "on", remainingClaimant: "on" },
          beklagte: { defendant: "on" },
        },
        {
          id: "shared-hauptantrag-2",
          betragForderung: "500",
          klagende: { deletedClaimant: "on", remainingClaimant: "on" },
          beklagte: { defendant: "on" },
        },
      ],
      schmerzengeldantrag: [
        {
          id: "sole-party-schmerzensgeldantrag-1",
          klagende: { deletedClaimant: "on" },
          beklagte: { defendant: "on" },
          nebenantraege: [{ id: "connected-nebenantrag" }],
        },
        unrelatedSchmerzensgeldantrag,
        {
          id: "sole-party-schmerzensgeldantrag-2",
          klagende: { deletedClaimant: "on" },
          beklagte: { defendant: "on" },
        },
        {
          id: "shared-schmerzensgeldantrag-1",
          klagende: { deletedClaimant: "on", remainingClaimant: "on" },
          beklagte: { defendant: "on" },
        },
        {
          id: "shared-schmerzensgeldantrag-2",
          klagende: { deletedClaimant: "on", remainingClaimant: "on" },
          beklagte: { defendant: "on" },
        },
      ],
      vortraege: [
        { id: "hauptantrag-vortrag-1", antragId: "sole-party-hauptantrag-1" },
        { id: "unrelated-vortrag", antragId: "unrelated-hauptantrag" },
        { id: "hauptantrag-vortrag-2", antragId: "sole-party-hauptantrag-1" },
        { id: "hauptantrag-vortrag-3", antragId: "sole-party-hauptantrag-2" },
        {
          id: "schmerzensgeld-vortrag-1",
          antragId: "sole-party-schmerzensgeldantrag-1",
        },
        {
          id: "shared-antrag-vortrag",
          antragId: "shared-schmerzensgeldantrag-1",
        },
        { id: "nebenantrag-vortrag", antragId: "connected-nebenantrag" },
        {
          id: "schmerzensgeld-vortrag-2",
          antragId: "sole-party-schmerzensgeldantrag-2",
        },
      ],
    });
    const commitSession = vi.fn().mockResolvedValue(new Headers());
    vi.mocked(getSessionManager).mockReturnValue({
      getSession: vi.fn().mockResolvedValue(session),
      commitSession,
      destroySession: vi.fn(),
    });

    const formData = new FormData();
    formData.set(
      "pathnameArrayItem",
      "/geld-einklagen/anwaltschaft/klagende-partei/klagenden",
    );
    formData.set("klagenden", "0");
    formData.set("_jsEnabled", "true");
    const response = await action({
      request: new Request(
        "http://localhost/action/geld-einklagen/anwaltschaft/delete-klage-partei",
        { method: "POST", body: formData },
      ),
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toBe(200);
    expect(session.data.klagenden).toEqual([{ id: "remainingClaimant" }]);
    expect(session.data.hauptantrag).toEqual([
      unrelatedHauptantrag,
      {
        id: "shared-hauptantrag-1",
        betragForderung: "400",
        klagende: { remainingClaimant: "on" },
        beklagte: { defendant: "on" },
      },
      {
        id: "shared-hauptantrag-2",
        betragForderung: "500",
        klagende: { remainingClaimant: "on" },
        beklagte: { defendant: "on" },
      },
    ]);
    expect(session.data.schmerzengeldantrag).toEqual([
      unrelatedSchmerzensgeldantrag,
      {
        id: "shared-schmerzensgeldantrag-1",
        klagende: { remainingClaimant: "on" },
        beklagte: { defendant: "on" },
      },
      {
        id: "shared-schmerzensgeldantrag-2",
        klagende: { remainingClaimant: "on" },
        beklagte: { defendant: "on" },
      },
    ]);
    expect(session.data.vortraege).toEqual([
      { id: "unrelated-vortrag", antragId: "unrelated-hauptantrag" },
      {
        id: "shared-antrag-vortrag",
        antragId: "shared-schmerzensgeldantrag-1",
      },
    ]);
    expect(commitSession).toHaveBeenCalledWith(session);
  });

  it("deletes a beklagte Partei's sole-party Antraege and updates its shared Antraege without changing unrelated items", async () => {
    const unrelatedHauptantrag = {
      id: "unrelated-hauptantrag",
      betragForderung: "200",
      klagende: { claimant: "on" },
      beklagte: { remainingDefendant: "on" },
    };
    const unrelatedSchmerzensgeldantrag = {
      id: "unrelated-schmerzensgeldantrag",
      klagende: { claimant: "on" },
      beklagte: { remainingDefendant: "on" },
    };
    const session = createSession({
      beklagten: [{ id: "deletedDefendant" }, { id: "remainingDefendant" }],
      hauptantrag: [
        {
          id: "sole-party-hauptantrag-1",
          betragForderung: "100",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on" },
        },
        unrelatedHauptantrag,
        {
          id: "sole-party-hauptantrag-2",
          betragForderung: "300",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on" },
        },
        {
          id: "shared-hauptantrag-1",
          betragForderung: "400",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on", remainingDefendant: "on" },
        },
        {
          id: "shared-hauptantrag-2",
          betragForderung: "500",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on", remainingDefendant: "on" },
        },
      ],
      schmerzengeldantrag: [
        {
          id: "sole-party-schmerzensgeldantrag-1",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on" },
          nebenantraege: [{ id: "connected-nebenantrag" }],
        },
        unrelatedSchmerzensgeldantrag,
        {
          id: "sole-party-schmerzensgeldantrag-2",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on" },
        },
        {
          id: "shared-schmerzensgeldantrag-1",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on", remainingDefendant: "on" },
        },
        {
          id: "shared-schmerzensgeldantrag-2",
          klagende: { claimant: "on" },
          beklagte: { deletedDefendant: "on", remainingDefendant: "on" },
        },
      ],
      vortraege: [
        { id: "hauptantrag-vortrag-1", antragId: "sole-party-hauptantrag-1" },
        { id: "unrelated-vortrag", antragId: "unrelated-hauptantrag" },
        { id: "hauptantrag-vortrag-2", antragId: "sole-party-hauptantrag-1" },
        { id: "hauptantrag-vortrag-3", antragId: "sole-party-hauptantrag-2" },
        {
          id: "schmerzensgeld-vortrag-1",
          antragId: "sole-party-schmerzensgeldantrag-1",
        },
        {
          id: "shared-antrag-vortrag",
          antragId: "shared-schmerzensgeldantrag-1",
        },
        { id: "nebenantrag-vortrag", antragId: "connected-nebenantrag" },
        {
          id: "schmerzensgeld-vortrag-2",
          antragId: "sole-party-schmerzensgeldantrag-2",
        },
      ],
    });
    const commitSession = vi.fn().mockResolvedValue(new Headers());
    vi.mocked(getSessionManager).mockReturnValue({
      getSession: vi.fn().mockResolvedValue(session),
      commitSession,
      destroySession: vi.fn(),
    });

    const formData = new FormData();
    formData.set(
      "pathnameArrayItem",
      "/geld-einklagen/anwaltschaft/beklagte-partei/beklagten",
    );
    formData.set("beklagten", "0");
    formData.set("_jsEnabled", "true");
    const response = await action({
      request: new Request(
        "http://localhost/action/geld-einklagen/anwaltschaft/delete-klage-partei",
        { method: "POST", body: formData },
      ),
      params: {},
      context: {},
    } as ActionFunctionArgs);

    expect(response.status).toBe(200);
    expect(session.data.beklagten).toEqual([{ id: "remainingDefendant" }]);
    expect(session.data.hauptantrag).toEqual([
      unrelatedHauptantrag,
      {
        id: "shared-hauptantrag-1",
        betragForderung: "400",
        klagende: { claimant: "on" },
        beklagte: { remainingDefendant: "on" },
      },
      {
        id: "shared-hauptantrag-2",
        betragForderung: "500",
        klagende: { claimant: "on" },
        beklagte: { remainingDefendant: "on" },
      },
    ]);
    expect(session.data.schmerzengeldantrag).toEqual([
      unrelatedSchmerzensgeldantrag,
      {
        id: "shared-schmerzensgeldantrag-1",
        klagende: { claimant: "on" },
        beklagte: { remainingDefendant: "on" },
      },
      {
        id: "shared-schmerzensgeldantrag-2",
        klagende: { claimant: "on" },
        beklagte: { remainingDefendant: "on" },
      },
    ]);
    expect(session.data.vortraege).toEqual([
      { id: "unrelated-vortrag", antragId: "unrelated-hauptantrag" },
      {
        id: "shared-antrag-vortrag",
        antragId: "shared-schmerzensgeldantrag-1",
      },
    ]);
    expect(commitSession).toHaveBeenCalledWith(session);
  });
});
