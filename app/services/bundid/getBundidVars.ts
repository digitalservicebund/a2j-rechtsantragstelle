import { config } from "~/services/env/public";

const { ENVIRONMENT } = config();

const BUNDID_IDP_ENTRY_POINT = {
  integration: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
  production: "https://id.bund.de/idp/profile/SAML2/POST/SSO",
} as const;

const BUNDID_ENTITY_ID = {
  integration: "https://service.justiz.de/sp", // TODO: rename to https://service.justiz.de/stag and upload new Metadaten
  production: "https://service.justiz.de/prod",
} as const;

function getByEnvironment(config: {
  integration: string;
  production: string;
}): string {
  return ENVIRONMENT === "production" || ENVIRONMENT === "preview"
    ? config.production
    : config.integration;
}

export const getBundIdEntryPoint = () =>
  getByEnvironment(BUNDID_IDP_ENTRY_POINT);

export const getBundIdEntityId = () => getByEnvironment(BUNDID_ENTITY_ID);
