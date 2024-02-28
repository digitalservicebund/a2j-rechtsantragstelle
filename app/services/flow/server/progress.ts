import type { FlowController } from "~/services/flow/server/buildFlowController";

export const getProgressProps = ({
  flowController,
  stepId,
  progressBarLabel,
}: {
  flowController: FlowController;
  stepId: string;
  progressBarLabel: string;
}) => {
  const { total, current } = flowController.getProgress(stepId);
  return {
    progress: current,
    max: total,
    label: progressBarLabel,
  };
};
