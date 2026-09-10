import { type LoaderFunctionArgs } from "react-router";
import { clientIpContext } from "~/services/requestContext.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ips = forwardedFor?.split(",").map((ip) => ip.trim()) ?? [];

  return Response.json({
    clientIp: ips[0] ?? null,
    ips,
    expressReqIp: context.get(clientIpContext) ?? null,
  });
};
