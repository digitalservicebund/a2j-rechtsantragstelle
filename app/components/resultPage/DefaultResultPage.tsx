import { useLoaderData } from "@remix-run/react";
import type { loader } from "../../routes/shared/result.server";
import { ResultPage } from "./ResultPage";

export function DefaultResultPage() {
  const {
    flowId,
    common,
    cmsData,
    reasons,
    progress,
    nextButton,
    backButton,
    bannerState,
    amtsgerichtCommon,
    courts,
  } = useLoaderData<typeof loader>();

  return (
    <ResultPage
      flowId={flowId}
      common={common}
      cmsData={cmsData}
      reasons={reasons}
      progress={progress}
      nextButton={nextButton}
      backButton={backButton}
      bannerState={bannerState}
      amtsgerichtCommon={amtsgerichtCommon}
      courts={courts}
    />
  );
}
