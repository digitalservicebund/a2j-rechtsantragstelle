import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import { DefaultFormFlowPage } from "./DefaultFormFlowPage";
import { KernFormFlowPage } from "./kern/KernFormFlowPage";

export function FormFlowPage() {
  const showKernUX = useShowKernUX();
  return showKernUX ? <KernFormFlowPage /> : <DefaultFormFlowPage />;
}
