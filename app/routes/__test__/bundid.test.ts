import { vi, describe, it, expect } from "vitest";
import { action } from "../bundid.success";
import { type ActionFunctionArgs } from "react-router";
import { loader } from "../bundid";
import { bundIdSamlAttributes } from "~/services/bundid/attributes";

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(() => true),
}));

vi.mock("~/services/bundid/index.server", () => ({
  getBundIdSamlConfig: vi.fn(() => ({
    options: { entryPoint: "https://fake.idp.example.com/sso" },
    getAuthorizeMessageAsync: vi.fn(() => ({
      SAMLRequest: "FAKE_SAML_REQUEST",
    })),
    validatePostResponseAsync: vi.fn(() => ({
      profile: {
        [bundIdSamlAttributes.givenName]: "Erika",
        [bundIdSamlAttributes.surname]: "Mustermann",
      },
    })),
  })),
}));

describe("BundID loader", () => {
  it("should return url and samlRequest", async () => {
    const result = await loader();
    expect(result).toEqual({
      url: "https://fake.idp.example.com/sso",
      samlRequest: "FAKE_SAML_REQUEST",
      relayState: "https://a2j-staging.dev.ds4g.net/bundid/success",
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
      givenName: "Erika",
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
    const { getBundIdSamlConfig: getBundIdSamlConfig } = await import(
      "~/services/bundid/index.server"
    );
    (getBundIdSamlConfig as any).mockImplementationOnce(() => ({
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
      givenName: undefined,
      surname: undefined,
    });
  });
});
