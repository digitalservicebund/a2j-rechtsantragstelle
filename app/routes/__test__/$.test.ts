import { describe, it, expect } from "vitest";
import { action, loader } from "../$";
import { type LoaderFunctionArgs } from "react-router";
import { redirectMap } from "~/services/routing/redirects";
import { faker } from "@faker-js/faker";
import invariant from "tiny-invariant";
import * as cmsModule from "~/services/cms/index.server";

describe("Generic route", () => {
  describe("loader", () => {
    it("returns 200 with content and meta", async () => {
      const pageMeta = { title: "page title" };
      vi.spyOn(cmsModule, "fetchPage").mockResolvedValueOnce({
        pageMeta,
        content: [],
        locale: "de",
        slug: "/",
      });
      const request = new Request("http://localhost");
      const resp = await loader({ request } as LoaderFunctionArgs);
      expect(resp).toHaveProperty("content");
      expect(resp).toEqual(expect.objectContaining({ meta: pageMeta }));
    });

    it("returns redirect if pathname in redirectMap", async () => {
      const [src, destination] = faker.helpers.objectEntry(redirectMap);
      const request = new Request("http://localhost" + src);
      const resp = await loader({ request } as LoaderFunctionArgs);
      const expectedHeaders = new Headers();
      expectedHeaders.append("Location", destination);
      invariant(resp instanceof Response);
      expect(resp.status).toEqual(301);
      expect(resp.headers.get("Location")).toEqual(destination);
    });

    it("throws 404 if not found", async () => {
      const request = new Request("http://localhost/settings");
      vi.spyOn(cmsModule, "fetchPage").mockThrowOnce({
        name: "StrapiPageNotFound",
      });
      const resp = async () => await loader({ request } as LoaderFunctionArgs);
      await expect(resp).rejects.toThrow(
        expect.objectContaining({ status: 404 }),
      );
    });
  });

  describe("action", () => {
    it("returns a 405 Response", async () => {
      expect((await action()).status).toBe(405);
    });
  });
});
