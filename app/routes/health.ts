import axios from "axios";
import { config } from "~/services/env/env.server";

export const loader = async () => {
  try {
    if (config().CMS === "STRAPI") {
      await axios.get(`${config().STRAPI_HOST}/_health`, {
        validateStatus: (status) => status < 300,
        headers: { Authorization: "Bearer " + config().STRAPI_ACCESS_KEY },
      });
    }
    return new Response("I'm fine, thanks for asking :)");
  } catch (error: unknown) {
    console.error("healthcheck ❌", { error });
    return new Response("ERROR", { status: 503 });
  }
};
