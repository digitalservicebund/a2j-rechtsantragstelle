import { useLoaderData } from "@remix-run/react";
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

  return (
    <UserFeedbackContext.Provider
      value={{ bannerState: bannerState, flowId: flowId }}
    >
      <ResultPage
        flowId={flowId}
        common={common}
        cmsData={cmsData}
        reasons={reasons}
        backButton={backButton}
        bannerState={bannerState}
        amtsgerichtCommon={amtsgerichtCommon}
        courts={[]}
      />
    </UserFeedbackContext.Provider>
  );
}
