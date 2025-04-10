import { type PostHog } from "posthog-node";
import { createContext, useContext } from "react";

type PosthogContext = {
  posthog: Partial<PostHog> | undefined;
  /**
   * Need to expose cookie header here as we're using it to uniquely identify users upon event capture
   */
  cookieHeader: string | null;
};

export const PosthogContext = createContext<PosthogContext>({
  posthog: undefined,
  cookieHeader: null,
});

export function usePosthog() {
  return useContext(PosthogContext);
}
