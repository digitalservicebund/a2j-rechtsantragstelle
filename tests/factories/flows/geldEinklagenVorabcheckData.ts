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
      kontaktaufnahme: {
        kontaktaufnahme: "yes",
      },
    };
  });

export const kontaktaufnahmeNoDataFactory =
  kontaktaufnahmeYesDataFactory.params({
    kontaktaufnahme: {
      kontaktaufnahme: "no",
    },
  });

invariant(formPages.frist.schema);
type FristData = z.infer<typeof formPages.frist.schema>;
type FristFactoryData = KontaktaufnahmeFactoryData & FristData;

export const fristYesDataFactory = Factory.define<FristFactoryData>(() => {
  return {
    ...kontaktaufnahmeYesDataFactory.build(),
    frist: {
      frist: "yes",
    },
  };
});

export const fristYesExpiredDataFactory = fristYesDataFactory.params({
  frist: {
    frist: "yesExpired",
  },
});

export const fristNoDataFactory = fristYesDataFactory.params({
  frist: {
    frist: "no",
  },
});

invariant(formPages["vor-2020"].schema);
const vor2020Schema = formPages["vor-2020"].schema;
type Vor2020Data = z.infer<typeof vor2020Schema>;
type Vor2020FactoryData = FristFactoryData & Vor2020Data;

export const vor2020NoDataFactory = Factory.define<Vor2020FactoryData>(() => {
  return {
    ...fristYesExpiredDataFactory.build(),
    "vor-2020": {
      "vor-2020": "no",
    },
  };
});

export const vor2020YesDataFactory = vor2020NoDataFactory.params({
  "vor-2020": {
    "vor-2020": "yes",
  },
});
