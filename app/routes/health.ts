import type { LoaderFunctionArgs } from "@remix-run/node";
import axios from "axios";
import { config } from "~/services/env/env.server";
import { logError } from "~/services/logging";
import { handleRemixContext } from "~/services/remixContext";
import { getRedisStatus } from "~/services/session.server/redis";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  handleRemixContext(context); // Needed to potentially set redisClient

  try {
    if ((await getRedisStatus()) !== "ready")
      throw Error("Reddis connection not ready");
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
