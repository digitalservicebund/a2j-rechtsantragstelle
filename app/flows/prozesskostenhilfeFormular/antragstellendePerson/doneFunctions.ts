import type { GenericGuard } from "~/flows/guards.server";
import type { ProzesskostenhilfeAntragstellendePersonContext } from "~/flows/prozesskostenhilfeFormular/antragstellendePerson/context";

export const antragstellendePersonDone: GenericGuard<
  ProzesskostenhilfeAntragstellendePersonContext
> = ({ context }) => {
  console.log(context);
  return false;
};
