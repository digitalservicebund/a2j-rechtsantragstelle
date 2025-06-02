import { type PostHog } from "posthog-js";
import { createContext, useContext } from "react";

type PosthogContext = {
  posthogClient: PostHog | undefined;
  hasTrackingConsent: boolean | undefined;
};

export const PosthogContext = createContext<PosthogContext>({
  posthogClient: undefined,
  hasTrackingConsent: undefined,
});

export const usePosthog = () => useContext(PosthogContext);
