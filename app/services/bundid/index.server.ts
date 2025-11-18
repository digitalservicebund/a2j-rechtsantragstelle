import { config } from "~/services/env/env.server";
import { SAML } from "@node-saml/node-saml";
import fs from "fs";
export function getBundIdSamlConfig() {
  const samlAuthnRequestExtensions = {
    "akdb:AuthenticationRequest": {
      "@xmlns:akdb": "https://www.akdb.de/request/2018/09",
      "@EnableStatusDetail": "true",
      "@Version": "2",

      "akdb:AuthnMethods": {
        "akdb:eID": {
          "akdb:Enabled": true,
        },
      },

      "akdb:RequestedAttributes": {
        "akdb:RequestedAttribute": [
          {
            "@Name": "urn:oid:1.3.6.1.4.1.33592.1.3.5",
            "@RequiredAttribute": "false",
          },
          {
            "@Name": "urn:oid:1.3.6.1.4.1.25484.494450.3",
            "@RequiredAttribute": "true",
          },
          {
            "@Name": "urn:oid:1.3.6.1.5.5.7.9.2",
            "@RequiredAttribute": "false",
          },
          { "@Name": "urn:oid:2.5.4.16", "@RequiredAttribute": "false" },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.149",
            "@RequiredAttribute": "false",
          },
          { "@Name": "urn:oid:2.5.4.17", "@RequiredAttribute": "false" },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.225599",
            "@RequiredAttribute": "false",
          },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.225566",
            "@RequiredAttribute": "false",
          },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.225577",
            "@RequiredAttribute": "false",
          },
          { "@Name": "urn:oid:2.5.4.18", "@RequiredAttribute": "true" },
          {
            "@Name": "urn:oid:0.9.2342.19200300.100.1.40",
            "@RequiredAttribute": "false",
          },
          { "@Name": "urn:oid:2.5.4.7", "@RequiredAttribute": "false" },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.261.94",
            "@RequiredAttribute": "false",
          },
          { "@Name": "urn:oid:2.5.4.42", "@RequiredAttribute": "true" },
          { "@Name": "urn:oid:2.5.4.4", "@RequiredAttribute": "true" },
          {
            "@Name": "urn:oid:1.2.40.0.10.2.1.1.55",
            "@RequiredAttribute": "false",
          },
          {
            "@Name": "urn:oid:0.9.2342.19200300.100.1.3",
            "@RequiredAttribute": "false",
          },
        ],
      },
      "akdb:DisplayInformation": {
        "classic-ui:Version": {
          "@xmlns:classic-ui":
            "https://www.akdb.de/request/2018/09/classic-ui/v1",
          //        "classic-ui:Purpose":
          //            "Dieses Feld wird fachlich in der Schnittstelle akzeptiert, jedoch aktuell nicht verwendet. Das ist aber zu Dokumentationszwecken weiterhin vorhanden. Von einer Verwendung wird aber abgeraten.",
          "classic-ui:OrganizationDisplayName": "Onlinedienste der Justiz",
          "classic-ui:Lang": "de",
          "classic-ui:BackURL": "https://a2j-staging.dev.ds4g.net/bundid",
          "classic-ui:OnlineServiceId": config().BUNDID_AUTH_BMI_ID,
        },
      },
    },
  };

  const saml = new SAML({
    entryPoint: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    issuer: "https://service.justiz.de/sp",
    callbackUrl: config().SAML_ASSERTION_CONSUMER_SERVICE_URL ?? "",
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    allowCreate: true,
    idpCert: config().SAML_IDP_CERT ?? "",
    privateKey: fs.readFileSync("data/saml/sp_privateKey.pem", "utf-8"),
    decryptionPvk: fs.readFileSync(
      "data/saml/sp_privateKeyEncryption.pem",
      "utf-8",
    ),
    authnRequestBinding: "HTTP-POST",
    skipRequestCompression: true,
    wantAssertionsSigned: true,
    signatureAlgorithm: "sha256-mgf1",
    samlAuthnRequestExtensions: samlAuthnRequestExtensions,
    acceptedClockSkewMs: 5000,
    disableRequestedAuthnContext: true,
    forceAuthn: false,
  });
  return saml;
}
