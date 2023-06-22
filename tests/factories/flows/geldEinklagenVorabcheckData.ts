import { Factory } from "fishery";
import invariant from "tiny-invariant";
import type { z } from "zod";
import { formPages } from "~/models/flows/geldEinklagen/pages";

invariant(formPages.kontaktaufnahme.schema);
type KontaktaufnahmeData = z.infer<typeof formPages.kontaktaufnahme.schema>;

export const kontaktaufnahmeYesDataFactory =
  Factory.define<KontaktaufnahmeData>(() => {
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

export const fristYesDataFactory = Factory.define<FristData>(() => {
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
