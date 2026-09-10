import { type LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ips = forwardedFor?.split(",").map((ip) => ip.trim()) ?? [];

  return Response.json({ clientIp: ips[0] ?? null, ips });
};
