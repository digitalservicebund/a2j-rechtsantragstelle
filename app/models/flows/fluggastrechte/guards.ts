import { FluggastrechtVorabcheckContext } from "./context";

type Guard = (context: FluggastrechtVorabcheckContext) => boolean;

function yesNoGuards<Field extends keyof FluggastrechtVorabcheckContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context[field] === "no") as Guard,
  };
}

const isPartnerAirport = (context: FluggastrechtVorabcheckContext) => {
  const partnerAirports = ["BRE", "BER", "DUS", "FRA", "HAM", "MUC", "STR"];
  return (
    partnerAirports.includes(context.startAirport ?? "") ||
    partnerAirports.includes(context.endAirport ?? "")
  );
};

export const guards = {
  bereichVerspaetet: (context: FluggastrechtVorabcheckContext) =>
    context.bereich === "verspaetet",
  isPartnerAirport,
  fluggesellschaftFilled: (context: FluggastrechtVorabcheckContext) =>
    Boolean(context.startAirport && context.endAirport),
  ...yesNoGuards("verspaetung"),
  ...yesNoGuards("checkin"),
  ...yesNoGuards("gruende"),
  ...yesNoGuards("entschaedigung"),
  ...yesNoGuards("gericht"),
  ...yesNoGuards("anwalt"),
  kostenlosYesOther: (context: FluggastrechtVorabcheckContext) =>
    context.kostenlos === "yesOther",
  ...yesNoGuards("rabatt"),
  ...yesNoGuards("buchung"),
};
