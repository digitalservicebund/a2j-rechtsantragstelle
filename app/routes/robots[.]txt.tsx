import { config } from "~/services/env/env.server";

export const loader = () => {
  // Initial robot content is to disallow all
  let robotContent = "User-agent: *\nDisallow: /";

  if (config().ENVIRONMENT === "production") {
    robotContent =
      "User-agent: *\nDisallow: /storybook\nDisallow: /prozesskostenhilfe/direktlink";
  }

  return new Response(robotContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
