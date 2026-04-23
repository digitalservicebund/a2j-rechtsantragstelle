import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { allSessionUserData, getSessionManager } from ".";

export async function anyUserData(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const sessionDataSizesPromises = allSessionUserData.map((context) =>
    getSessionManager(context).getSession(cookieHeader),
  );

  return Promise.all(sessionDataSizesPromises).then((sessions) => {
    return sessions.some((sessionData) =>
      Object.keys(sessionData.data).some(
        (key) => key !== "__vaultKey" && key !== CSRFKey,
      ),
    );
  });
}
