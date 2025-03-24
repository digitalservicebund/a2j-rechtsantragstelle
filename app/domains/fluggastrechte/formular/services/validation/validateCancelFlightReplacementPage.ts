import { z } from "zod";
import { MultiFieldsValidationBaseSchema } from "~/domains/multiFieldsFlowValidation";
import { convertToTimestamp } from "~/util/date";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";

const TWO_HOURS_MILLISECONDS = 2 * 60 * 60 * 1000;
const FOUR_HOURS_MILLISECONDS = 4 * 60 * 60 * 1000;

const FIELDS_FOR_VALIDATION = [
  "annullierungErsatzverbindungFlugnummer",
  "annullierungErsatzverbindungAbflugsDatum",
  "annullierungErsatzverbindungAbflugsZeit",
  "annullierungErsatzverbindungAnkunftsDatum",
  "annullierungErsatzverbindungAnkunftsZeit",
];

const getFieldsForValidation = (data: Record<string, string>) => {
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
  const actualTimeDifferenceInMs = endTimestamp - startTimestamp;
  return actualTimeDifferenceInMs < threshold;
}

function isStartTimestampMoreThan(
  startTimestamp: number,
  endTimestamp: number,
  threshold: number,
) {
  const actualTimeDifferenceInMs = endTimestamp - startTimestamp;
  return actualTimeDifferenceInMs > threshold;
}

const getDatesTimes = (data: Record<string, string>) => {
  const originalDepartureDateTime = convertToTimestamp(
    data.direktAbflugsDatum,
    data.direktAbflugsZeit,
  );

  const departureDateTime = convertToTimestamp(
    data.annullierungErsatzverbindungAbflugsDatum,
    data.annullierungErsatzverbindungAbflugsZeit,
  );

  const originalArrivalDateTime = convertToTimestamp(
    data.direktAnkunftsDatum,
    data.direktAnkunftsZeit,
  );

  const arrivalDateTime = convertToTimestamp(
    data.annullierungErsatzverbindungAnkunftsDatum,
    data.annullierungErsatzverbindungAnkunftsZeit,
  );

  return {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  };
};

const addIssueToAnnullierungErsatzverbindungAbflug = (
  ctx: z.RefinementCtx,
  message: string,
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: message,
    path: ["annullierungErsatzverbindungAbflugsDatum"],
  });

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: message,
    path: ["annullierungErsatzverbindungAbflugsZeit"],
  });
};

const addIssueToAnnullierungErsatzverbindungAnkunft = (
  ctx: z.RefinementCtx,
  message: string,
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: message,
    path: ["annullierungErsatzverbindungAnkunftsDatum"],
  });

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: message,
    path: ["annullierungErsatzverbindungAnkunftsZeit"],
  });
};

const validateFieldsBetween7And13Days = (
  data: Record<string, string>,
  ctx: z.RefinementCtx,
) => {
  const ersatzflugStartenZweiStunden = data.ersatzflugStartenZweiStunden;
  const ersatzflugLandenVierStunden = data.ersatzflugLandenVierStunden;

  const {
    originalDepartureDateTime,
    departureDateTime,
    originalArrivalDateTime,
    arrivalDateTime,
  } = getDatesTimes(data);

  if (
    ersatzflugStartenZweiStunden === "yes" &&
    isStartTimestampLessThan(
      departureDateTime,
      originalDepartureDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssueToAnnullierungErsatzverbindungAbflug(
      ctx,
      "departureTwoHoursLateFromOriginalDeparture",
    );
  }

  if (
    ersatzflugStartenZweiStunden === "no" &&
    isStartTimestampMoreThan(
      originalDepartureDateTime,
      departureDateTime,
      TWO_HOURS_MILLISECONDS,
    )
  ) {
    addIssueToAnnullierungErsatzverbindungAbflug(
      ctx,
      "departureTwoHoursLessFromOriginalDeparture",
    );
  }

  if (
    ersatzflugLandenVierStunden === "yes" &&
    isStartTimestampLessThan(
      arrivalDateTime,
      originalArrivalDateTime,
      FOUR_HOURS_MILLISECONDS,
    )
  ) {
    addIssueToAnnullierungErsatzverbindungAnkunft(
      ctx,
      "arrivalFourHoursLateFromOriginalDeparture",
    );
  }

  if (
    ersatzflugLandenVierStunden === "no" &&
    isStartTimestampMoreThan(
      originalArrivalDateTime,
      arrivalDateTime,
      FOUR_HOURS_MILLISECONDS,
    )
  ) {
    addIssueToAnnullierungErsatzverbindungAnkunft(
      ctx,
      "arrivalFourHoursLessFromOriginalDeparture",
    );
  }
};

export function validateCancelFlightReplacementPage(
  baseSchema: MultiFieldsValidationBaseSchema,
) {
  return baseSchema.superRefine((data, ctx) => {
    const fields = getFieldsForValidation(data);

    const isAnyFieldFilled = fields.some(
      ({ value }) => !isFieldEmptyOrUndefined(value),
    );

    if (!isAnyFieldFilled) {
      return;
    }

    for (const { value, path } of fields) {
      if (isFieldEmptyOrUndefined(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fillAllOrNone",
          path,
        });
      }
    }

    if (data.ankuendigung === "between7And13Days") {
      validateFieldsBetween7And13Days(data, ctx);
    }
  });
}
