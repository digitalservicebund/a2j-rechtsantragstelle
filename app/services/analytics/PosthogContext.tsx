import { type PostHog } from "posthog-js";
import { createContext, useContext } from "react";

type PosthogContext = {
  posthogClient: PostHog | undefined;
};

export const PosthogContext = createContext<PosthogContext>({
  posthogClient: undefined,
});

export function usePosthog() {
  const { posthogClient } = useContext(PosthogContext);
  return {
    posthogClient,
  };
}
