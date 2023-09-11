import { config } from "~/services/env/web";

export const useSecureCookie = ["staging", "production"].includes(
  config().ENVIRONMENT,
);
