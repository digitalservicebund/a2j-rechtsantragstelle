import type { buildFlowController } from "~/services/flow/server/buildFlowController";

export const getProgressProps = ({
  flowController,
  stepId,
  progressBarLabel,
}: {
  flowController: ReturnType<typeof buildFlowController>;
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
