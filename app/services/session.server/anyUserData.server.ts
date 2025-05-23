import { allSessionUserData, getSessionManager } from ".";

export async function anyUserData(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const sessionDataSizesPromises = allSessionUserData.map((context) =>
    getSessionManager(context)
      .getSession(cookieHeader)
      .then((session) => Object.keys(session.data).length),
  );

  return Promise.all(sessionDataSizesPromises).then((sessionDataSizes) => {
    return sessionDataSizes.some((sessionDataSize) => sessionDataSize > 0);
  });
}
