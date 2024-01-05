import { LoaderFunctionArgs } from "@remix-run/node";
import { config } from "~/services/env/env.server";

export const loader = () => {
  // Initial robot content is to disallow all
  let robotContent = `
                        User-agent: *
                        Disallow: /
                       `;

  if (config().ENVIRONMENT === "production") {
    robotContent = `
                        User-agent: *
                        Disallow: /storybook
                       `;
  }

  return new Response(robotContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
