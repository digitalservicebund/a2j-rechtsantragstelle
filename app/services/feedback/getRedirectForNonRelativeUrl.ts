export function getRedirectForNonRelativeUrl(searchParameterUrl: string) {
  if (!searchParameterUrl.startsWith("/")) {
    return new Response(null, { status: 400 });
  }
}
