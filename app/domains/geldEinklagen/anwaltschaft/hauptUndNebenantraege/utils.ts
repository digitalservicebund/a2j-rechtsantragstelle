export const formatSplitDate = (
  date: { day?: string; month?: string; year?: string } | undefined,
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
  sinceRechtshaengigkeit?: boolean;
};

export const getInterestText = ({
  rate,
  method,
  start,
  end,
  sinceRechtshaengigkeit = false,
}: InterestTextParams): string => {
  if (rate == null || !method) return "";

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

  const rateText = `${rate} ${
    sinceRechtshaengigkeit ? description.replace("p. a.", "p.a.") : description
  }`;
  const startDate = formatSplitDate(start);
  const endDate = formatSplitDate(end);

  let period = "";

  if (sinceRechtshaengigkeit) {
    period = ` seit ${startDate ? `dem ${startDate}` : "Rechtshängigkeit"}${
      endDate ? ` bis zum ${endDate}` : ""
    }`;
  } else if (startDate && endDate) {
    period = ` vom ${startDate} bis zum ${endDate}`;
  } else if (startDate) {
    period = ` seit dem ${startDate}`;
  } else if (endDate) {
    period = ` bis zum ${endDate}`;
  }

  return ` nebst Zinsen in Höhe von ${rateText}${period}`;
};
