import { z } from "zod";
import type { StepComponentProps } from "~/components/form/steps";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kidsTotal: buildKidsCountValidationSchema(),
});

export const kinderAnzahlSimpleStep = {
  schema,
  component: (props: StepComponentProps) => <></>,
};
