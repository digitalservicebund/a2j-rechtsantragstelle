import type { UserData } from "~/domains/userData";
import type {
  FlowController,
  StepState,
} from "~/services/flow/server/buildFlowController";
import type { z } from "zod";
import type { StrapiSummaryOverviewSectionSchema } from "~/services/cms/models/content/StrapiSummaryOverviewSection";

type StrapiSummaryOverviewSection = z.infer<
  typeof StrapiSummaryOverviewSectionSchema
>;
import {
  getFormQuestionsForFields,
  createFieldToStepMapping,
} from "./getFormQuestions";
import type { FlowId } from "~/domains/flowIds";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";

const EXCLUDED_FIELDS_USERDATA = new Set(["pageData"]);

function isUserDataFieldEmpty(value: unknown): boolean {
  // Only consider null, undefined, or empty strings as empty
  // All other values (including "no", false, 0) are considered answered
  return value == null || value === "";
}

// Get field label from CMS questions with simple fallback
function getUserDataFieldLabel(
  fieldName: string,
  fieldQuestions: Record<string, { question?: string }>,
): string {
  const question = fieldQuestions[fieldName]?.question;

  if (question) {
    return question;
  }

  console.warn(
    `⚠️ No CMS question found for field "${fieldName}" - using field name as fallback`,
  );
  return fieldName;
}

export async function generateSummaryFromUserData(
  userData: UserData,
  flowId: FlowId,
  flowController?: FlowController,
): Promise<StrapiSummaryOverviewSection[]> {
  console.log("generateSummaryFromUserData", userData);

  const userDataFields = Object.keys(userData).filter(
    (fieldName) =>
      !EXCLUDED_FIELDS_USERDATA.has(fieldName) &&
      userData[fieldName] !== undefined,
  );

  if (userDataFields.length === 0) {
    return [];
  }

  const fieldQuestions = await getFormQuestionsForFields(
    userDataFields,
    flowId,
  );

  const formFieldsMap = await fetchAllFormFields(flowId);
  const fieldToStepMapping = createFieldToStepMapping(formFieldsMap);

  if (!flowController) {
    throw new Error("FlowController is required for auto-generation");
  }

  const fieldGroups = groupFieldsByFlowNavigation(
    userDataFields,
    flowId,
    flowController,
    fieldToStepMapping,
  );

  const sections: StrapiSummaryOverviewSection[] = [];
  let sectionCounter = 1;

  for (const [sectionName, boxes] of Object.entries(fieldGroups)) {
    const sectionBoxes: Array<{
      id: number;
      title: {
        __component: "basic.heading";
        text: string;
        tagName: "h3";
        look: "ds-heading-03-reg";
        id: number;
      };
      stepId: string;
      boxItems: Array<{
        title: string;
        inlineItems: Array<{
          field: string;
          emptyValuePlaceholder: string;
        }>;
      }>;
    }> = [];

    let boxCounter = 1;
    for (const [boxName, fields] of Object.entries(boxes)) {
      if (fields.length === 0) {
        continue;
      }

      // Create inline items for this box (including empty fields)
      const inlineItems = fields.map((fieldName) => {
        const value = userData[fieldName];
        const isEmpty = isUserDataFieldEmpty(value);
        console.log(
          `🔍 Field "${fieldName}" value:`,
          value,
          "isEmpty:",
          isEmpty,
        );

        const label = getUserDataFieldLabel(fieldName, fieldQuestions);
        return {
          field: fieldName,
          label,
          emptyValuePlaceholder: "",
        };
      });

      // Find a representative stepId for this box (use the first field's stepId)
      const representativeField = fields[0];
      const representativeStepId = fieldToStepMapping[representativeField];

      console.log(
        `📝 Box "${boxName}" -> representativeField "${representativeField}" -> stepId "${representativeStepId}"`,
      );

      // Skip boxes that don't have a real stepId
      if (!representativeStepId) {
        console.log(
          `⚠️ Skipping box "${boxName}" - no real stepId found for field "${representativeField}"`,
        );
        continue;
      }

      const box = {
        id: sectionCounter * 100 + boxCounter,
        title: {
          __component: "basic.heading" as const,
          text: getBoxDisplayName(boxName),
          tagName: "h3" as const,
          look: "ds-heading-03-reg" as const,
          id: sectionCounter * 100 + boxCounter,
        },
        stepId: representativeStepId,
        boxItems: inlineItems.map((item) => ({
          title: item.label,
          inlineItems: [
            {
              field: item.field,
              emptyValuePlaceholder:
                item.emptyValuePlaceholder || "Keine Angabe",
            },
          ],
        })),
      };

      sectionBoxes.push(box);
      boxCounter++;
    }

    if (sectionBoxes.length === 0) {
      continue;
    }

    // Create summary section with multiple boxes
    const section: StrapiSummaryOverviewSection = {
      __component: "page.summary-overview-section",
      id: sectionCounter,
      title: {
        __component: "basic.heading",
        text: getGroupDisplayName(sectionName),
        tagName: "h2",
        look: "ds-heading-02-reg",
        id: sectionCounter,
      },
      boxes: sectionBoxes,
    };

    sections.push(section);
    sectionCounter++;
  }

  return sections;
}

// Sections to exclude from auto-generated summaries
const EXCLUDED_SECTIONS = new Set([
  "start",
  "abgabe",
  "zusammenfassung",
  "summary",
  "ergebnis",
  "result",
]);

function groupFieldsByFlowNavigation(
  fields: string[],
  _flowId: FlowId,
  flowController: FlowController,
  fieldToStepMapping: Record<string, string>,
): Record<string, Record<string, string[]>> {
  // Get the step hierarchy from flow controller
  const stepStates = flowController.stepStates();

  const stepToSectionMapping = createStepToSectionMapping(stepStates);

  const groups: Record<string, Record<string, string[]>> = {};

  for (const field of fields) {
    let stepId = fieldToStepMapping[field];

    if (!stepId) {
      // Look for nested field patterns like "berufart.selbststaendig" -> "/finanzielle-angaben/einkommen/art"
      const nestedFieldMapping = Object.entries(fieldToStepMapping).find(
        ([mappedField]) => mappedField.startsWith(`${field}.`),
      );

      if (nestedFieldMapping) {
        stepId = nestedFieldMapping[1];
        fieldToStepMapping[field] = stepId;
        console.log(
          `Found nested mapping: "${field}" -> "${stepId}" via "${nestedFieldMapping[0]}"`,
        );
      }
    }

    if (!stepId) {
      // Field not found in any step, put it in "other" section
      addFieldToGroup(groups, "other", "zusaetzliche_angaben", field);
      continue;
    }

    // Get the top-level section for this step
    const sectionInfo = getSectionFromStepId(stepId, stepToSectionMapping);
    const sectionKey = sectionInfo.sectionKey.replace(/^\//, "");

    console.log(
      `Field "${field}" -> stepId "${stepId}" -> sectionKey "${sectionKey}" boxKey "${sectionInfo.boxKey}"`,
    );

    if (EXCLUDED_SECTIONS.has(sectionKey)) {
      console.log(`⏭️ Skipping excluded section: ${sectionKey}`);
      continue;
    }

    const boxKey = sectionInfo.boxKey ?? "default";
    addFieldToGroup(groups, sectionKey, boxKey, field);
  }

  return groups;
}

function createStepToSectionMapping(
  stepStates: StepState[],
): Record<string, { sectionKey: string; sectionTitle: string }> {
  const mapping: Record<string, { sectionKey: string; sectionTitle: string }> =
    {};

  function processStepState(stepState: StepState, parentSectionKey?: string) {
    // If this step has sub-states, it's likely a section header
    if (stepState.subStates && stepState.subStates.length > 0) {
      const sectionKey = stepState.stepId;

      // Map all sub-steps to this section
      for (const subState of stepState.subStates) {
        processStepState(subState, sectionKey);
      }
    } else {
      // This is a leaf step - map it to the parent section
      const sectionKey = parentSectionKey ?? stepState.stepId;
      mapping[stepState.stepId] = {
        sectionKey,
        sectionTitle: parentSectionKey ?? stepState.stepId,
      };
    }
  }

  for (const stepState of stepStates) {
    processStepState(stepState);
  }

  return mapping;
}

function getSectionFromStepId(
  stepId: string,
  stepToSectionMapping: Record<
    string,
    { sectionKey: string; sectionTitle: string }
  >,
): { sectionKey: string; boxKey?: string } {
  // First try exact match
  const sectionInfo = stepToSectionMapping[stepId];
  if (sectionInfo) {
    return {
      sectionKey: sectionInfo.sectionKey,
      boxKey: extractBoxKeyFromStepId(stepId),
    };
  }

  // Try to find a parent section by matching step prefixes
  // For example: "/finanzielle-angaben/partner/partner-einkommen-summe" should match "/finanzielle-angaben"
  for (const [mappedStepId, mappedSectionInfo] of Object.entries(
    stepToSectionMapping,
  )) {
    if (stepId.startsWith(mappedStepId + "/")) {
      return {
        sectionKey: mappedSectionInfo.sectionKey,
        boxKey: extractBoxKeyFromStepId(stepId, mappedStepId),
      };
    }
  }

  // Fallback: try to extract section from stepId path
  const pathParts = stepId.split("/").filter(Boolean);
  if (pathParts.length >= 2) {
    return {
      sectionKey: pathParts[0], // First part should be the main section
      boxKey: pathParts[1], // Second part should be the subsection
    };
  }

  return { sectionKey: "other" };
}

function extractBoxKeyFromStepId(
  stepId: string,
  parentStepId?: string,
): string {
  // Extract a meaningful box key from the step ID
  const pathParts = stepId.split("/").filter(Boolean);

  if (parentStepId) {
    // Remove the parent path to get the relative sub-path
    const parentParts = parentStepId.split("/").filter(Boolean);
    const relativeParts = pathParts.slice(parentParts.length);
    return relativeParts[0] || "default";
  }

  return pathParts[pathParts.length - 1] || "default";
}

function addFieldToGroup(
  groups: Record<string, Record<string, string[]>>,
  sectionKey: string,
  boxKey: string,
  field: string,
) {
  if (!groups[sectionKey]) {
    groups[sectionKey] = {};
  }
  if (!groups[sectionKey][boxKey]) {
    groups[sectionKey][boxKey] = [];
  }
  groups[sectionKey][boxKey].push(field);
}

function groupFieldsByLogicalBoxes(
  fields: string[],
): Record<string, Record<string, string[]>> {
  // Define field mappings to section -> box -> fields structure
  const fieldMappings: Record<string, { section: string; box: string }> = {
    // Grundvoraussetzungen
    rechtsschutzversicherung: {
      section: "grundvoraussetzungen",
      box: "rechtsschutz",
    },
    wurdeVerklagt: { section: "grundvoraussetzungen", box: "rechtslage" },
    klageEingereicht: { section: "grundvoraussetzungen", box: "rechtslage" },
    hamburgOderBremen: {
      section: "grundvoraussetzungen",
      box: "zustaendigkeit",
    },
    beratungshilfeBeantragt: {
      section: "grundvoraussetzungen",
      box: "vorherige_antraege",
    },
    eigeninitiativeGrundvorraussetzung: {
      section: "grundvoraussetzungen",
      box: "eigeninitiative",
    },
    anwaltskanzlei: { section: "grundvoraussetzungen", box: "anwalt" },

    // Personal data - all in one box
    vorname: { section: "personal", box: "persoenliche_daten" },
    nachname: { section: "personal", box: "persoenliche_daten" },
    geburtsdatum: { section: "personal", box: "persoenliche_daten" },
    plz: { section: "personal", box: "persoenliche_daten" },
    street: { section: "personal", box: "persoenliche_daten" },
    houseNumber: { section: "personal", box: "persoenliche_daten" },
    ort: { section: "personal", box: "persoenliche_daten" },
    telefonnummer: { section: "personal", box: "persoenliche_daten" },

    // Financial - separate into logical boxes like CMS
    staatlicheLeistungen: { section: "financial", box: "laufende_leistungen" },
    erwerbstaetig: { section: "financial", box: "erwerbstaetigkeit" },
    berufsituation: { section: "financial", box: "erwerbstaetigkeit" },
    einkommen: { section: "financial", box: "erwerbstaetigkeit" },
    weitereseinkommen: { section: "financial", box: "weiteres_einkommen" },
    partnerschaft: { section: "financial", box: "familienverhaeltnisse" },
    hasKinder: { section: "financial", box: "familienverhaeltnisse" },
    hasWeitereUnterhaltszahlungen: {
      section: "financial",
      box: "familienverhaeltnisse",
    },
    livingSituation: { section: "financial", box: "wohnsituation" },
    apartmentSizeSqm: { section: "financial", box: "wohnsituation" },
    apartmentPersonCount: { section: "financial", box: "wohnsituation" },
    apartmentCostFull: { section: "financial", box: "wohnsituation" },
    apartmentCostOwnShare: { section: "financial", box: "wohnsituation" },
    hasBankkonto: { section: "financial", box: "vermoegen" },
    hasGeldanlage: { section: "financial", box: "vermoegen" },
    hasKraftfahrzeug: { section: "financial", box: "vermoegen" },
    hasWertsache: { section: "financial", box: "vermoegen" },
    hasGrundeigentum: { section: "financial", box: "vermoegen" },
    hasAusgaben: { section: "financial", box: "ausgaben" },

    // Legal - separate boxes for different aspects
    bereich: { section: "legal", box: "rechtsgebiet" },
    gegenseite: { section: "legal", box: "verfahren" },
    beschreibung: { section: "legal", box: "sachverhalt" },
    ziel: { section: "legal", box: "ziel" },
    eigeninitiativeBeschreibung: {
      section: "legal",
      box: "eigeninitiative_legal",
    },

    // Other
    weitereAngaben: { section: "other", box: "zusaetzliche_angaben" },
  };

  // Group fields by section -> box -> fields
  const groups: Record<string, Record<string, string[]>> = {};

  for (const field of fields) {
    const mapping = fieldMappings[field];
    if (mapping) {
      if (!groups[mapping.section]) {
        groups[mapping.section] = {};
      }
      if (!groups[mapping.section][mapping.box]) {
        groups[mapping.section][mapping.box] = [];
      }
      groups[mapping.section][mapping.box].push(field);
    }
  }

  return groups;
}

function getGroupDisplayName(groupName: string): string {
  const groupNames: Record<string, string> = {
    // Legacy hardcoded mappings
    grundvoraussetzungen: "Grundvoraussetzungen",
    personal: "Persönliche Angaben",
    financial: "Finanzielle Angaben",
    legal: "Rechtliche Angaben",
    other: "Weitere Angaben",

    // Generic flow-based mappings (from navigation structure)
    "anwaltliche-vertretung": "Anwaltliche Vertretung",
    rechtsproblem: "Rechtsproblem",
    "finanzielle-angaben": "Finanzielle Angaben",
    "persoenliche-daten": "Persönliche Daten",
    "weitere-angaben": "Weitere Angaben",
  };

  return groupNames[groupName] || humanizeStepId(groupName);
}

function getBoxDisplayName(boxKey: string): string {
  const boxNames: Record<string, string> = {
    // Legacy hardcoded mappings
    rechtsschutz: "Rechtsschutzversicherung",
    rechtslage: "Rechtslage",
    zustaendigkeit: "Zuständigkeit",
    vorherige_antraege: "Vorherige Anträge",
    eigeninitiative: "Eigeninitiative",
    anwalt: "Anwaltliche Vertretung",
    persoenliche_daten: "Persönliche Angaben",
    laufende_leistungen: "Laufende Leistung zum Lebensunterhalt",
    erwerbstaetigkeit: "Erwerbstätig",
    weiteres_einkommen: "Weiteres Einkommen",
    familienverhaeltnisse: "Familienverhältnisse",
    wohnsituation: "Wohnsituation",
    vermoegen: "Vermögen",
    ausgaben: "Ausgaben",
    rechtsgebiet: "Rechtsgebiet",
    verfahren: "Verfahren",
    sachverhalt: "Sachverhalt",
    ziel: "Ziel",
    eigeninitiative_legal: "Eigeninitiative",
    zusaetzliche_angaben: "Weitere Angaben",
    default: "Angaben",
  };

  return boxNames[boxKey] || humanizeStepId(boxKey);
}

function humanizeStepId(stepId: string): string {
  // Convert kebab-case or snake_case step IDs to human-readable titles
  return stepId
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
