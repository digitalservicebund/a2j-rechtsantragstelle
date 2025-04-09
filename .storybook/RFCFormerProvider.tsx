import { FormProvider, useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { ReactNode } from "react";
import { z } from "zod";

type Props = {
  children: ReactNode;
};

export const RFCFormerProvider = ({ children }: Props) => {
  const form = useForm({
    validator: withZod(z.object({ name: z.string().optional() })),
  });

  return <FormProvider scope={form.scope()}> {children}</FormProvider>;
};
