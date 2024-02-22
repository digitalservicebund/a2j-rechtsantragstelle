import { partnerCourtAirports } from ".";
import type { Guards } from "../guards.server";
import type { FluggastrechtVorabcheckContext } from "./context";

function yesNoGuards<Field extends keyof FluggastrechtVorabcheckContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guards[string] } & {
  [field in Field as `${field}No`]: Guards[string];
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ({ context }) => context[field] === "yes",
    [`${field}No`]: ({ context }) => context[field] === "no",
  } satisfies Guards;
}

export const guards = {
  bereichVerspaetet: ({ context }) => context.bereich === "verspaetet",
  isPartnerAirport: ({ context }) => {
    const airportAbbreviations = Object.keys(partnerCourtAirports);
    return (
      airportAbbreviations.includes(context.startAirport ?? "") ||
      airportAbbreviations.includes(context.endAirport ?? "")
    );
  },
  fluggesellschaftFilled: ({ context }) =>
    Boolean(context.startAirport && context.endAirport),
  isKnownPartnerAirline: ({ context }) =>
    context.fluggesellschaft !== "sonstiges",
  ...yesNoGuards("verspaetung"),
  ...yesNoGuards("checkin"),
  ...yesNoGuards("gruende"),
  ...yesNoGuards("entschaedigung"),
  ...yesNoGuards("gericht"),
  ...yesNoGuards("abtretung"),
  ...yesNoGuards("kostenlos"),
  ...yesNoGuards("rabatt"),
  ...yesNoGuards("buchung"),
} satisfies Guards<FluggastrechtVorabcheckContext>;
