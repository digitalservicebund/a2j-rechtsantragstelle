import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { ResultPage } from "./ResultPage";
import type { loader } from "../../routes/shared/result.server";
import { UserFeedbackContext } from "../UserFeedback/UserFeedbackContext";

export function FluggastrechteResultPage() {
  const {
    flowId,
    common,
    cmsData,
    reasons,
    backButton,
    bannerState,
    amtsgerichtCommon,
  } = useLoaderData<typeof loader>();

  const userFeedbackContextValue = useMemo(
    () => ({ bannerState, flowId: flowId }),
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
        courts={[]}
      />
    </UserFeedbackContext.Provider>
  );
}
