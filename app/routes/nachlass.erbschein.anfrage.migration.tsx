import { redirect } from "react-router";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";
import { nachlassErbfolge } from "~/domains/nachlass/erbschein/erbfolge";
import { nachlassErbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";

export const loader = async () => {
  migrateSourceFlowDataToDestinationFlow(
    nachlassErbfolge,
    nachlassErbfolge,
    nachlassErbscheinAnfrage,
    "/nachlass/erbschein/anfrage",
  );

  return redirect("/nachlass/erbschein/anfrage");
};
