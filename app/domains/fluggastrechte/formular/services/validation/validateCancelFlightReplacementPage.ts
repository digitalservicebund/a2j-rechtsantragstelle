import { z } from "zod";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import type { fluggastrechteInputSchema } from "../../userData";

const ONE_HOUR_MILLISECONDS = 1 * 60 * 60 * 1000;
const TWO_HOURS_MILLISECONDS = 2 * 60 * 60 * 1000;
const FOUR_HOURS_MILLISECONDS = 4 * 60 * 60 * 1000;

const FIELDS_FOR_VALIDATION = [
  "annullierungErsatzverbindungFlugnummer",
  "annullierungErsatzverbindungAbflugsDatum",
  "annullierungErsatzverbindungAbflugsZeit",
  "annullierungErsatzverbindungAnkunftsDatum",
  "annullierungErsatzverbindungAnkunftsZeit",
] as const;

type SchemaSubset = Pick<
  typeof fluggastrechteInputSchema,
  | (typeof FIELDS_FOR_VALIDATION)[number]
  | "ankuendigung"
  | "ersatzflugStartenZweiStunden"
  | "ersatzflugLandenVierStunden"
  | "ersatzflugStartenEinStunde"
  | "ersatzflugLandenZweiStunden"
  | "direktAbflugsDatum"
  | "direktAbflugsZeit"
  | "direktAnkunftsDatum"
  | "direktAnkunftsZeit"
>;

type ParsedData = z.infer<z.ZodObject<SchemaSubset>>;

const getFieldsForValidation = (data: ParsedData) => {
  return FIELDS_FOR_VALIDATION.map((path) => ({
    value: data[path],
    path: [path],
  }));
};

function isStartTimestampLessThan(
  startTimestamp: number,
  endTimestamp: number,
  threshold: number,
) {
  return startTimestamp < endTimestamp - threshold;
}

function isStartTimestampMoreThan(
  startTimestamp: number,
  endTimestamp: number,
  threshold: number,
) {
  return startTimestamp >= endTimestamp - threshold;
}

const getFlightTimestamps = (data: ParsedData) => ({
  originalDepartureDateTime: convertToTimestamp(
    data.direktAbflugsDatum,
    data.direktAbflugsZeit,
  ),
  departureDateTime: convertToTimestamp(
    data.annullierungErsatzverbindungAbflugsDatum,
    data.annullierungErsatzverbindungAbflugsZeit,
  ),
  originalArrivalDateTime: convertToTimestamp(
    data.direktAnkunftsDatum,
    data.direktAnkunftsZeit,
  ),
  arrivalDateTime: convertToTimestamp(
    data.annullierungErsatzverbindungAnkunftsDatum,
    data.annullierungErsatzverbindungAnkunftsZeit,
  ),
});

const addIssue = (
  ctx: z.RefinementCtx,
  message: string,
  type: "departure" | "arrival",
) => {
  const fields =
    type === "departure"
      ? [
          "annullierungErsatzverbindungAbflugsDatum",
          "annullierungErsatzverbindungAbflugsZeit",
        ]
      : [
          "annullierungErsatzverbindungAnkunftsDatum",
          "annullierungErsatzverbindungAnkunftsZeit",
        ];

  fields.forEach((field) =>
    ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [field] }),
  );
};

const validateFieldsNoOrUntil6Days = (
  data: ParsedData,
  ctx: z.RefinementCtx,
) => {
  const ersatzflugStartenEinStunde = data.ersatzflugStartenEinStunde;
  const ersatzflugLandenZweiStunden = data.ersatzflugLandenZweiStunden;

  const {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  } = getFlightTimestamps(data);

  if (
    ersatzflugStartenEinStunde === "yes" &&
    isStartTimestampMoreThan(
      departureDateTime,
      originalDepartureDateTime,
      ONE_HOUR_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "departureOneHourLateFromOriginalDeparture", "departure");
  }

  if (
    ersatzflugStartenEinStunde === "no" &&
    isStartTimestampLessThan(
      departureDateTime,
      originalDepartureDateTime,
      ONE_HOUR_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "departureOneHourLessFromOriginalDeparture", "departure");
  }

  if (
    ersatzflugLandenZweiStunden === "yes" &&
    isStartTimestampMoreThan(
      originalArrivalDateTime,
      arrivalDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "arrivalTwoHoursLateFromOriginalArrival", "arrival");
  }

  if (
    ersatzflugLandenZweiStunden === "no" &&
    isStartTimestampLessThan(
      originalArrivalDateTime,
      arrivalDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "arrivalTwoHoursLessFromOriginalArrival", "arrival");
  }
};

const validateFieldsBetween7And13Days = (
  data: ParsedData,
  ctx: z.RefinementCtx,
) => {
  const ersatzflugStartenZweiStunden = data.ersatzflugStartenZweiStunden;
  const ersatzflugLandenVierStunden = data.ersatzflugLandenVierStunden;

  const {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  } = getFlightTimestamps(data);

  if (
    ersatzflugStartenZweiStunden === "yes" &&
    isStartTimestampMoreThan(
      departureDateTime,
      originalDepartureDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "departureTwoHoursLateFromOriginalDeparture", "departure");
  }

  if (
    ersatzflugStartenZweiStunden === "no" &&
    isStartTimestampLessThan(
      departureDateTime,
      originalDepartureDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "departureTwoHoursLessFromOriginalDeparture", "departure");
  }

  if (
    ersatzflugLandenVierStunden === "yes" &&
    isStartTimestampMoreThan(
      originalArrivalDateTime,
      arrivalDateTime,
      FOUR_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "arrivalFourHoursLateFromOriginalArrival", "arrival");
  }

  if (
    ersatzflugLandenVierStunden === "no" &&
    isStartTimestampLessThan(
      originalArrivalDateTime,
      arrivalDateTime,
      FOUR_HOURS_MILLISECONDS,
    )
  ) {
    addIssue(ctx, "arrivalFourHoursLessFromOriginalArrival", "arrival");
  }
};

export function validateCancelFlightReplacementPage(
  baseSchema: MultiFieldsValidationBaseSchema<SchemaSubset>,
) {
  return baseSchema.superRefine((data, ctx) => {
    const fields = getFieldsForValidation(data);

    const isAnyFieldFilled = fields.some(({ value }) => Boolean(value));
    if (!isAnyFieldFilled) return;

    for (const { value, path } of fields) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fillAllOrNone",
          path,
        });
      }
    }
    if (fields.some(({ value }) => !value)) return false;

    if (data.ankuendigung === "between7And13Days") {
      validateFieldsBetween7And13Days(data, ctx);
    }

    if (data.ankuendigung === "no" || data.ankuendigung === "until6Days") {
      validateFieldsNoOrUntil6Days(data, ctx);
    }
  });
}
