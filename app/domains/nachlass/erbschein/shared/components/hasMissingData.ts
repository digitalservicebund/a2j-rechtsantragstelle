import { type Kind, type Elternteil, type ElternteilKind } from "../erbfolgeTypes";
export type SummaryPerson = Kind | Elternteil | ElternteilKind;

export const migrationDataIsEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

export const hasMissingDate = (
  date:
    | {
        day?: string;
        month?: string;
        year?: string;
      }
    | undefined,
) =>
  !date ||
  migrationDataIsEmpty(date.day) ||
  migrationDataIsEmpty(date.month) ||
  migrationDataIsEmpty(date.year);

export const hasMissingAddress = (item: SummaryPerson) =>
  "strasse" in item &&
  [item.strasse, item.hausnummer, item.plz, item.ort, item.land].some(
    migrationDataIsEmpty,
  );
