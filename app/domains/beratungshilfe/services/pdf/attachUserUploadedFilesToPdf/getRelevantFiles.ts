import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";

export const getRelevantFiles = (
  evidence: Array<{ savedFileKey?: string }> | undefined,
  sessionId: string,
  flowId: "/beratungshilfe/antrag",
  condition?: boolean,
) => {
    const relevantFilesPromises: Array<Array<Promise<Uint8Array>>> = [];

    if (condition && evidence) {
    relevantFilesPromises.push(
      evidence.map((fileMeta) =>
        downloadUserFileFromS3(sessionId, flowId, fileMeta.savedFileKey ?? ""),
      ),
    );
  }
  return Promise.all(relevantFilesPromises.flat());
};
