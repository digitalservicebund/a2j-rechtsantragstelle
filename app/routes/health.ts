import axios from "axios";
import { config } from "~/services/env/env.server";
import { logError } from "~/services/logging";
import { getRedisStatus } from "~/services/session.server/redis";

export const loader = async () => {
  try {
    if (getRedisStatus() !== "ready") throw Error("Redis connection not ready");
    if (config().CMS === "STRAPI") {
      await axios.get(`${config().STRAPI_HOST}/_health`, {
        validateStatus: (status) => status < 300,
        headers: { Authorization: "Bearer " + config().STRAPI_ACCESS_KEY },
      });
    }
    return new Response("I'm fine, thanks for asking :)");
  } catch (error: unknown) {
    logError({ message: "healthcheck ❌", error });
    return new Response("ERROR", { status: 503 });
  }
};
