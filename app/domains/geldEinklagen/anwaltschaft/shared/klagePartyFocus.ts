import {
  type KlageParteiType,
  type KlageParteiVerhaeltnis,
} from "./anwaltschaftSchemas";

const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 100;

export const focusOnKlageParteiTitle = (
  relationship: KlageParteiVerhaeltnis,
  partyType: KlageParteiType,
  itemIndex: number,
) => {
  setTimeout(() => {
    const heading =
      document.getElementById(`${relationship}-partei-${itemIndex}`) ??
      document.getElementById(`${relationship}-${partyType}`);
    heading?.focus();
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

export const focusOnGesetzlicheVertretungTitle = (
  relationship: KlageParteiVerhaeltnis,
  parentArrayItemIndex: number,
) => {
  setTimeout(() => {
    document
      .getElementById(
        `${relationship}-partei-${parentArrayItemIndex}-gesetzliche-vertretung`,
      )
      ?.focus();
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};
