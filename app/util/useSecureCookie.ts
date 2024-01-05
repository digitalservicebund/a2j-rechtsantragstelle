import { config } from "~/services/env/web";

export const useSecureCookie = ["staging", "production", "preview"].includes(
  config().ENVIRONMENT,
);
