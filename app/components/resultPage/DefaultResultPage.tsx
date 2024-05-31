import { useLoaderData } from "@remix-run/react";
import { ResultPage } from "./ResultPage";
import type { loader } from "../../routes/shared/result.server";

export function DefaultResultPage() {
  const {
    flowId,
    common,
    cmsData,
    reasons,
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
      backButton={backButton}
      bannerState={bannerState}
      amtsgerichtCommon={amtsgerichtCommon}
      courts={courts}
    />
  );
}
