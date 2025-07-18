import type { z } from "zod";
import type { ParsePayload } from "zod/v4/core";
import { type MultiFieldsValidationBaseSchema } from "~/domains/types";
import { convertToTimestamp } from "~/util/date";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
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

type SubsetCtx = ParsePayload<z.infer<z.ZodObject<SchemaSubset>>>;

const getFieldsForValidation = (data: SubsetCtx["value"]) => {
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

const getFlightTimestamps = (data: SubsetCtx["value"]) => ({
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
  ctx: SubsetCtx,
  message: string,
  type: "departure" | "arrival",
) => {
  const fields =
    type === "departure"
      ? ([
          "annullierungErsatzverbindungAbflugsDatum",
          "annullierungErsatzverbindungAbflugsZeit",
        ] as const)
      : ([
          "annullierungErsatzverbindungAnkunftsDatum",
          "annullierungErsatzverbindungAnkunftsZeit",
        ] as const);

  fields.forEach((field) =>
    ctx.issues.push({
      code: "custom",
      message,
      path: [field],
      input: ctx.value[field],
    }),
  );
};

const validateFieldsNoOrUntil6Days = (ctx: SubsetCtx) => {
  const ersatzflugStartenEinStunde = ctx.value.ersatzflugStartenEinStunde;
  const ersatzflugLandenZweiStunden = ctx.value.ersatzflugLandenZweiStunden;

  const {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  } = getFlightTimestamps(ctx.value);

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

const validateFieldsBetween7And13Days = (ctx: SubsetCtx) => {
  const ersatzflugStartenZweiStunden = ctx.value.ersatzflugStartenZweiStunden;
  const ersatzflugLandenVierStunden = ctx.value.ersatzflugLandenVierStunden;

  const {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  } = getFlightTimestamps(ctx.value);

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
  return baseSchema.check((ctx) => {
    const fields = getFieldsForValidation(ctx.value);

    const isAnyFieldFilled = fields.some(
      ({ value }) => !isFieldEmptyOrUndefined(value),
    );

    if (!isAnyFieldFilled) {
      return;
    }

    for (const { value, path } of fields) {
      if (isFieldEmptyOrUndefined(value)) {
        ctx.issues.push({
          code: "custom",
          message: "fillAllOrNone",
          path,
          input: value,
        });
      }
    }

    if (ctx.value.ankuendigung === "between7And13Days") {
      validateFieldsBetween7And13Days(ctx);
    }

    if (
      ctx.value.ankuendigung === "no" ||
      ctx.value.ankuendigung === "until6Days"
    ) {
      validateFieldsNoOrUntil6Days(ctx);
    }
  });
}
