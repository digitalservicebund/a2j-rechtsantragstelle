const THREE_HOURS_MILLISECONDS = 3 * 60 * 60 * 1000;

export function isStartTimestampLessThanThreeHours(
  startTimestamp: number,
  endTimestamp: number,
) {
  const actualTimeDifferenceInMs = endTimestamp - startTimestamp;
  return actualTimeDifferenceInMs < THREE_HOURS_MILLISECONDS;
}
