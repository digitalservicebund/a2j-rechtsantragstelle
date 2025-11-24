import z from "zod";
import { config } from "../env/env.server";

export const bundIdSamlAttributes = {
  givenName: "urn:oid:2.5.4.42",
  surname: "urn:oid:2.5.4.4",
  mail: "urn:oid:0.9.2342.19200300.100.1.3",
  postalAddress: "urn:oid:2.5.4.16",
  postalCode: "urn:oid:2.5.4.17",
  localityName: "urn:oid:2.5.4.7",
  country: "urn:oid:1.2.40.0.10.2.1.1.225599",
  personalTitle: "urn:oid:0.9.2342.19200300.100.1.40",
  gender: "urn:oid:1.3.6.1.4.1.33592.1.3.5",
  birthdate: "urn:oid:1.2.40.0.10.2.1.1.55",
  placeOfBirth: "urn:oid:1.3.6.1.5.5.7.9.2",
  birthName: "urn:oid:1.2.40.0.10.2.1.1.225566",
  nationality: "urn:oid:1.2.40.0.10.2.1.1.225577",
  documentType: "urn:oid: 1.2.40.0.10.2.1.1.552255",
  DeMail: "urn:oid:1.3.6.1.4.1.55605.70737875.1.1.1.7.1",
  telephoneNumber: "urn:oid:2.5.4.20",
  "eIDAS-Issuing-Country": "urn:oid:1.3.6.1.4.1.25484.494450.10.1",
  communityId: "urn:oid:1.3.6.1.4.1.25484.494450.5 ",
} as const;

export const bundIdSamlTechnicalAttributes = {
  bPK2: "urn:oid:1.3.6.1.4.1.25484.494450.3",
  "EID-CITIZEN-QAA-LEVEL": "urn:oid: 1.2.40.0.10.2.1.1.261.94",
  "akdb:TrustLevel": "",
  Version: "urn:oid:1.3.6.1.4.1.25484.494450.1",
  AssertionProvedBy: "urn:oid:1.3.6.1.4.1.25484.494450.2",
  legacyPostfachHandle: "urn:oid:2.5.4.18",
  applicationId: "urn:oid:1.3.6.1.4.1.25484.494450.4 ",
  pseudonym: "urn:oid:1.2.40.0.10.2.1.1.226699 ",
} as const;

const requiredAttribute = (attribute: string) => ({
  "@Name": attribute,
  "@RequiredAttribute": "true",
});

const { SAML_ASSERTION_CONSUMER_SERVICE_URL, BUNDID_AUTH_BMI_ID } = config();

export const samlAuthnRequestExtensions = {
  "akdb:AuthenticationRequest": {
    "@xmlns:akdb": "https://www.akdb.de/request/2018/09",
    "@EnableStatusDetail": "true",
    "@Version": "2",
    "akdb:AuthnMethods": {
      "akdb:Benutzername": { "akdb:Enabled": true },
      "akdb:eID": { "akdb:Enabled": true },
    },
    "akdb:RequestedAttributes": {
      "akdb:RequestedAttribute": [
        requiredAttribute(bundIdSamlTechnicalAttributes.bPK2),
        requiredAttribute(bundIdSamlTechnicalAttributes.legacyPostfachHandle),
        requiredAttribute(bundIdSamlAttributes.givenName),
        requiredAttribute(bundIdSamlAttributes.surname),
        {
          "@Name": "urn:oid:1.3.6.1.4.1.33592.1.3.5",
          "@RequiredAttribute": "false",
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
        {
          "@Name": "urn:oid:0.9.2342.19200300.100.1.40",
          "@RequiredAttribute": "false",
        },
        { "@Name": "urn:oid:2.5.4.7", "@RequiredAttribute": "false" },
        {
          "@Name": "urn:oid:1.2.40.0.10.2.1.1.261.94",
          "@RequiredAttribute": "false",
        },
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
        "classic-ui:OrganizationDisplayName": "Onlinedienste der Justiz",
        "classic-ui:Lang": "de",
        "classic-ui:BackURL": SAML_ASSERTION_CONSUMER_SERVICE_URL, // maybe without /success?
        "classic-ui:OnlineServiceId": BUNDID_AUTH_BMI_ID,
      },
    },
  },
} as const;

export const attributeSchema = z
  .object({
    [bundIdSamlAttributes.givenName]: z.string().optional(),
    [bundIdSamlAttributes.surname]: z.string().optional(),
  })
  .transform((data) => ({
    givenName: data[bundIdSamlAttributes.givenName],
    surname: data[bundIdSamlAttributes.surname],
  }));
