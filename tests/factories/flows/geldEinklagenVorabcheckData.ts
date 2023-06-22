import { Factory } from "fishery";
import invariant from "tiny-invariant";
import type { z } from "zod";
import { formPages } from "~/models/flows/geldEinklagen/pages";

invariant(formPages.kontaktaufnahme.schema);
type KontaktaufnahmeData = z.infer<typeof formPages.kontaktaufnahme.schema>;
type KontaktaufnahmeFactoryData = KontaktaufnahmeData;

export const kontaktaufnahmeYesDataFactory =
  Factory.define<KontaktaufnahmeFactoryData>(() => {
    return {
      kontaktaufnahme: { kontaktaufnahme: "yes" },
    };
  });

export const kontaktaufnahmeNoDataFactory =
  kontaktaufnahmeYesDataFactory.params({
    kontaktaufnahme: { kontaktaufnahme: "no" },
  });

invariant(formPages.fristAbgelaufen.schema);
type FristData = z.infer<typeof formPages.fristAbgelaufen.schema>;
type FristFactoryData = KontaktaufnahmeFactoryData & FristData;

export const fristYesDataFactory = Factory.define<FristFactoryData>(() => {
  return {
    ...kontaktaufnahmeYesDataFactory.build(),
    fristAbgelaufen: { fristAbgelaufen: "yes" },
  };
});

export const fristNotSetDataFactory = fristYesDataFactory.params({
  fristAbgelaufen: { fristAbgelaufen: "yes" },
});

export const fristNoDataFactory = fristYesDataFactory.params({
  fristAbgelaufen: { fristAbgelaufen: "no" },
});

invariant(formPages["verjaehrt"].schema);
const verjaehrtSchema = formPages["verjaehrt"].schema;
type VerjaehrtData = z.infer<typeof verjaehrtSchema>;
type VerjaehrtFactoryData = FristFactoryData & VerjaehrtData;

export const verjaehrtNoDataFactory = Factory.define<VerjaehrtFactoryData>(
  () => {
    return {
      ...fristNotSetDataFactory.build(),
      verjaehrt: { verjaehrt: "no" },
    };
  }
);

export const verjaehrtYesDataFactory = verjaehrtNoDataFactory.params({
  verjaehrt: { verjaehrt: "yes" },
});

invariant(formPages.beweise.schema);
type BeweiseData = z.infer<typeof formPages.beweise.schema>;
type BeweiseFactoryData = VerjaehrtFactoryData & BeweiseData;

export const beweiseYesDataFactory = Factory.define<BeweiseFactoryData>(() => {
  return {
    ...verjaehrtNoDataFactory.build(),
    beweise: { beweise: "yes" },
  };
});

export const beweiseNoDataFactory = beweiseYesDataFactory.params({
  beweise: { beweise: "no" },
});
