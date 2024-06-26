import { createContext, useContext } from "react";
import { BannerState } from ".";

type UserFeedbackContext = {
  bannerState?: BannerState;
  flowId?: string;
};

export const UserFeedbackContext = createContext<UserFeedbackContext>({});

export function useUserFeedback(): UserFeedbackContext {
  return useContext(UserFeedbackContext);
}
