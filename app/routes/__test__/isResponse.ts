import { isValidationErrorResponse } from "@rvf/react";
import { type validationError } from "@rvf/react-router";
import invariant from "tiny-invariant";

export const isResponse = (value: unknown): value is Response =>
  value instanceof Response;

export function assertResponse(value: unknown): asserts value is Response {
  invariant(isResponse(value), "Expected value to be a Response");
}

export function assertValidationError(
  value: unknown,
): asserts value is ReturnType<typeof validationError> {
  invariant(
    value &&
      typeof value === "object" &&
      "data" in value &&
      isValidationErrorResponse(value.data),
    "Expected value to be a Response with data",
  );
}
