import { useLoaderData } from "@remix-run/react";
import { ResultPage } from "./ResultPage";
import type { loader } from "../../routes/shared/result.server";

export function DefaultResultPage() {
  const { common, cmsData, reasons, backButton } =
    useLoaderData<typeof loader>();

  return (
    <ResultPage
      common={common}
      cmsData={cmsData}
      reasons={reasons}
      backButton={backButton}
    />
  );
}
