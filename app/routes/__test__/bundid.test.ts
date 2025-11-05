import { vi, describe, it, expect } from "vitest";
import { action } from "../bundid.success";
import { type ActionFunctionArgs } from "react-router";
import { loader } from "../bundid";

vi.mock("~/services/bundid/index.server", () => ({
  getBundIdServiceProvider: vi.fn(() => ({
    options: { entryPoint: "https://fake.idp.example.com/sso" },
    getAuthorizeFormAsync: vi.fn(() => ({
      context: "FAKE_SAML_REQUEST",
    })),
    validatePostResponseAsync: vi.fn(() => ({
      profile: {
        "urn:oid:2.5.4.42": "Erika",
        "urn:oid:2.5.4.4": "Mustermann",
      },
    })),
  })),
}));

describe("BundID loader", () => {
  it("should return url, samlRequest, and relayState", async () => {
    const request = new Request("https://app.example.com/test");

    const result = await loader({ request } as unknown as ActionFunctionArgs);

    expect(result).toEqual({
      url: "https://fake.idp.example.com/sso",
      samlRequest: { context: "FAKE_SAML_REQUEST" },
      relayState: "https://app.example.com/test",
    });
  });
});

describe("BundID action", () => {
  it("should parse SAMLResponse and return attributes", async () => {
    const form = new FormData();
    form.set("SAMLResponse", "FAKE_SAML_RESPONSE");
    form.set("RelayState", "https://app.example.com/callback");

    const request = new Request("https://app.example.com", {
      method: "POST",
      body: form,
    });

    const result = await action({ request } as unknown as ActionFunctionArgs);

    expect(result).toEqual({
      prename: "Erika",
      surname: "Mustermann",
    });
  });

  it("should throw an error if SAMLResponse is missing", async () => {
    const form = new FormData();
    const request = new Request("https://app.example.com", {
      method: "POST",
      body: form,
    });

    await expect(
      action({ request } as unknown as ActionFunctionArgs),
    ).rejects.toThrow("Invalid SAML Response");
  });
  it("should handle missing attributes", async () => {
    const { getBundIdServiceProvider } = await import(
      "~/services/bundid/index.server"
    );
    (getBundIdServiceProvider as any).mockImplementationOnce(() => ({
      validatePostResponseAsync: () => ({ profile: {} }),
    }));

    const form = new FormData();
    form.set("SAMLResponse", "FAKE_SAML_RESPONSE");
    const request = new Request("https://app.example.com", {
      method: "POST",
      body: form,
    });

    const result = await action({ request } as unknown as ActionFunctionArgs);

    expect(result).toEqual({
      prename: undefined,
      surname: undefined,
    });
  });
});
