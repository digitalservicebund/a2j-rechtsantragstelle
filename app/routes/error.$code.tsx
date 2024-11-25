import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = ({ params }: LoaderFunctionArgs) => {
  const errorCode = Number(params.code);
  if ([502, 503, 504].includes(errorCode))
    throw new Response("Simulated server error", {
      status: errorCode,
    });

  throw new Response("Invalid error code", { status: 400 });
};
