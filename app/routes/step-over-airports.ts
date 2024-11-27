import { type LoaderFunctionArgs } from "@remix-run/node";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";

export function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const ersterZwischenstopp = searchParams.get("ersterZwischenstopp") ?? "";
  const zweiterZwischenstopp = searchParams.get("zweiterZwischenstopp") ?? "";
  const dritterZwischenstopp = searchParams.get("dritterZwischenstopp") ?? "";

  return {
    ersterZwischenstoppName: getAirportNameByIataCode(ersterZwischenstopp),
    zweiterZwischenstoppName: getAirportNameByIataCode(zweiterZwischenstopp),
    dritterZwischenstoppName: getAirportNameByIataCode(dritterZwischenstopp),
  };
}
