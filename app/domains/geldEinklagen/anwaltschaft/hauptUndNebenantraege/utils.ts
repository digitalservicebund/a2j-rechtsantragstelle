export const formatEuro = (amount: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

export const formatSplitDate = (
  date:
    | { day?: string; month?: string; year?: string }
    | undefined,
) => {
  if (!date?.day || !date?.month || !date?.year) {
    return undefined;
  }

  return `${date.day.padStart(2, "0")}.${date.month.padStart(2, "0")}.${date.year}`;
};

type InterestTextParams = {
  rate?: number | null;
  method?: string | null;
  start?: { day?: string; month?: string; year?: string };
  end?: { day?: string; month?: string; year?: string };
};

export const getInterestText = ({
  rate,
  method,
  start,
  end,
}: InterestTextParams): string => {
  if (rate == null || !method) return "";

  const startDate = formatSplitDate(start);

  if (!startDate) return "";

  const methods: Record<string, string> = {
    jaehrlicherZinssatzUeberBasiszins:
      "Prozentpunkten über dem jeweiligen Basiszinssatz p. a.",
    jaehrlicherZinssatz: "Prozent p. a.",
    monatlicherZinssatzUeberBasiszins:
      "Prozentpunkten über dem jeweiligen Basiszinssatz p. a., monatlich abrechenbar",
    monatlicherZinssatz: "Prozent p. a., monatlich abrechenbar",
  };

  const description = methods[method];
  if (!description) return "";

  const rateText = `${rate} ${description}`;
  const endDate = formatSplitDate(end);

  const period = endDate
    ? ` vom ${startDate} bis zum ${endDate}`
    : ` seit dem ${startDate}`;

  return ` nebst Zinsen in Höhe von ${rateText}${period}`;
};