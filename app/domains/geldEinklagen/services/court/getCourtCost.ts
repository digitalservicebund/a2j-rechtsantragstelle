const gerichtskostenvorschuss = {
  below_500: 80,
  above_500: 122,
  above_1000: 164,
  above_1500: 206,
  above_2000: 251,
  above_3000: 296,
  above_4000: 341,
  above_5000: 386,
  above_6000: 431,
  above_7000: 476,
  above_8000: 521,
  above_9000: 566,
} as const;

export const gerichtskostenFromBetrag = (betrag: number) => {
  if (betrag <= 500) return gerichtskostenvorschuss.below_500;
  if (betrag <= 1000) return gerichtskostenvorschuss.above_500;
  if (betrag <= 1500) return gerichtskostenvorschuss.above_1000;
  if (betrag <= 2000) return gerichtskostenvorschuss.above_1500;
  if (betrag <= 3000) return gerichtskostenvorschuss.above_2000;
  if (betrag <= 4000) return gerichtskostenvorschuss.above_3000;
  if (betrag <= 5000) return gerichtskostenvorschuss.above_4000;
  if (betrag <= 6000) return gerichtskostenvorschuss.above_5000;
  if (betrag <= 7000) return gerichtskostenvorschuss.above_6000;
  if (betrag <= 8000) return gerichtskostenvorschuss.above_7000;
  if (betrag <= 9000) return gerichtskostenvorschuss.above_8000;
  return gerichtskostenvorschuss.above_9000;
};
