import { type LoaderFunctionArgs } from "@remix-run/node";
import { getAirlineNameByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode";
import { defaultHeaders } from "~/rootHeaders";

export function loader({ params }: LoaderFunctionArgs) {
  const { iataCode } = params;
  const name = getAirlineNameByIataCode(iataCode);

  const responseData = { name };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json", ...defaultHeaders },
  });
}
