type ConnectionDuration = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

const MILLISECONDS_IN_A_MINUTE = 1000 * 60;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * 24;

export function calculateDuration({
  startDate,
  startTime,
  endDate,
  endTime,
}: ConnectionDuration): string {
  const parseDateTime = (date: string, time: string): Date => {
    const [day, month, year] = date.split(".").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const start = parseDateTime(startDate, startTime);
  const end = parseDateTime(endDate, endTime);

  const diffInMilliseconds = end.getTime() - start.getTime();
  if (diffInMilliseconds < 0) return "";

  const diffDays = Math.floor(diffInMilliseconds / MILLISECONDS_IN_A_DAY);
  const diffHours = Math.floor(
    (diffInMilliseconds % MILLISECONDS_IN_A_DAY) / MILLISECONDS_IN_AN_HOUR,
  );
  const diffMinutes = Math.floor(
    (diffInMilliseconds % MILLISECONDS_IN_AN_HOUR) / MILLISECONDS_IN_A_MINUTE,
  );

  // Handle edge case: zero duration
  if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
    return "";
  }

  const dayLabel = diffDays === 1 ? "Tag" : "Tage";
  const hourLabel = diffHours === 1 ? "Stunde" : "Stunden";
  const minuteLabel = diffMinutes === 1 ? "Minute" : "Minuten";

  const parts: string[] = [];
  if (diffDays > 0) parts.push(`${diffDays} ${dayLabel}`);
  if (diffHours > 0) parts.push(`${diffHours} ${hourLabel}`);
  if (diffMinutes > 0) parts.push(`${diffMinutes} ${minuteLabel}`);

  return parts.join(", ");
}
