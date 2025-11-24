import { vi, describe, it, expect } from "vitest";
import { action } from "../bundid.success";
import { type ActionFunctionArgs } from "react-router";
import { loader } from "../bundid";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(() => true),
}));

const mockUrl = "https://fake.idp.example.com/sso";
const mockSamlRequest = "FAKE_SAML_REQUEST";

vi.mock("~/services/bundid/index.server", () => ({
  generateSamlRequest: vi.fn(() => ({
    url: mockUrl,
    samlRequest: mockSamlRequest,
  })),
  validateSamlResponse: vi.fn(() => ({
    givenName: "Erika",
    surname: "Mustermann",
  })),
}));

describe("BundID loader", () => {
  it("should return url and samlRequest", async () => {
    const result = await loader();
    expect(result).toEqual({ url: mockUrl, samlRequest: mockSamlRequest });
  });
});

describe("BundID action", () => {
  it("should parse SAMLResponse and return attributes", async () => {
    const form = new FormData();
    form.set("SAMLResponse", mockSamlRequest);

    const request = new Request("https://app.example.com", {
      method: "POST",
      body: form,
    });

    const result = await action(mockRouteArgsFromRequest(request));

    expect(result).toEqual({
      givenName: "Erika",
      surname: "Mustermann",
    });
  });

  it("should throw an error if SAMLResponse is missing", async () => {
    const request = new Request("https://app.example.com", {
      method: "POST",
      body: new FormData(),
    });

    await expect(action(mockRouteArgsFromRequest(request))).rejects.toThrow();
  });
});
