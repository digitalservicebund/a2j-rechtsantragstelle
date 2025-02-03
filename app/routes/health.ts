import { config } from "~/services/env/env.server";
import { logError } from "~/services/logging";
import { getRedisStatus } from "~/services/session.server/redis";

export const loader = async (): Promise<Response> => {
  try {
    if (getRedisStatus() !== "ready") {
      logError({ error: "Redis connection not ready" });
      return new Response("ERROR: Redis connection not ready", { status: 503 });
    }

    if (config().CMS === "STRAPI") {
      const response: Response = await fetch(
        `${config().STRAPI_HOST}/_health`,
        {
          headers: { Authorization: `Bearer + ${config().STRAPI_ACCESS_KEY}` },
        },
      );

      if (!response.ok) {
        logError({
          error: `Health check failed with status ${response.status}`,
        });
        return new Response(
          `Health check failed with status ${response.status}`,
          { status: 503 },
        );
      }
    }

    return new Response("I'm fine, thanks for asking :)");
  } catch (error: unknown) {
    logError({ message: "healthcheck ❌", error });
    return new Response("ERROR", { status: 503 });
  }
};
