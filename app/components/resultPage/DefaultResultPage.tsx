import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { ResultPage } from "./ResultPage";
import type { loader } from "../../routes/shared/result.server";
import { UserFeedbackContext } from "../UserFeedback/UserFeedbackContext";

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

  const userFeedbackContextValue = useMemo(
    () => ({ bannerState: bannerState, flowId: flowId }),
    [bannerState, flowId],
  );

  return (
    <UserFeedbackContext.Provider value={userFeedbackContextValue}>
      <ResultPage
        common={common}
        cmsData={cmsData}
        reasons={reasons}
        backButton={backButton}
        amtsgerichtCommon={amtsgerichtCommon}
        courts={courts}
      />
    </UserFeedbackContext.Provider>
  );
}
