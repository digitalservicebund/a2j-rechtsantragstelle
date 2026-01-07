const gerichtskostenvorschuss = {
  below_500: 120,
  above_500: 183,
  above_1000: 246,
  above_1500: 309,
  above_2000: 376.5,
  above_3000: 444,
  above_4000: 511.5,
  above_5000: 579,
  above_6000: 646.5,
  above_7000: 714,
  above_8000: 781.5,
  above_9000: 849,
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
