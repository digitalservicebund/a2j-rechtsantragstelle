import { type LoaderFunctionArgs } from "@remix-run/node";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";

export function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const startAirport = searchParams.get("startAirport") ?? "";
  const endAirport = searchParams.get("endAirport") ?? "";

  return `${getAirportNameByIataCode(startAirport)} - ${getAirportNameByIataCode(endAirport)}`;
}
