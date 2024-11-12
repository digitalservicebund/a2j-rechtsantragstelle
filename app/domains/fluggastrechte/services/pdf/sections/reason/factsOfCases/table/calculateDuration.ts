type ConnectionDuration = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

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

  const diffHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffMinutes = Math.floor(
    (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
  );

  const hourLabel = diffHours === 1 ? "Stunde" : "Stunden";
  const minuteLabel = diffMinutes === 1 ? "Minute" : "Minuten";

  let duration = `${diffHours} ${hourLabel}`;
  if (diffMinutes > 0) {
    duration += ` und ${diffMinutes} ${minuteLabel}`;
  }

  return duration;
}
