import { config } from "~/services/env/public";

export const useSecureCookie = ["staging", "production", "preview"].includes(
  config().ENVIRONMENT,
);
