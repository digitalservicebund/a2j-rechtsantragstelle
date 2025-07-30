import { type PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const berHAntragGrundvoraussetzungenPages = {
  rechtsschutzversicherung: {
    stepId: "grundvoraussetzungen/rechtsschutzversicherung",
    pageSchema: {
      rechtsschutzversicherung: YesNoAnswer,
    },
  },
  rechtsschutzversicherungHinweis: {
    stepId: "rechtsschutzversicherung-hinweis",
  },
  wurdeVerklagt: {
    stepId: "grundvoraussetzungen/wurde-verklagt",
    pageSchema: {
      wurdeVerklagt: YesNoAnswer,
    },
  },
  wurdeVerklagtHinweis: {
    stepId: "grundvoraussetzungen/wurde-verklagt-hinweis",
  },
  klageEingereicht: {
    stepId: "grundvoraussetzungen/klage-eingereicht",
    pageSchema: {
      klageEingereicht: YesNoAnswer,
    },
  },
  klageEingereichtHinweis: {
    stepId: "grundvoraussetzungen/klage-eingereicht-hinweis",
  },
  hamburgOderBremen: {
    stepId: "grundvoraussetzungen/hamburg-oder-bremen",
    pageSchema: {
      hamburgOderBremen: YesNoAnswer,
    },
  },
  hamburgOderBremenHinweis: {
    stepId: "grundvoraussetzungen/hamburg-oder-bremen-hinweis",
  },
  beratungshilfeBeantragt: {
    stepId: "grundvoraussetzungen/beratungshilfe-beantragt",
    pageSchema: {
      beratungshilfeBeantragt: YesNoAnswer,
    },
  },
  beratungshilfeBeantragtHinweis: {
    stepId: "grundvoraussetzungen/beratungshilfe-beantragt-hinweis",
  },
  eigeninitiativeGrundvorraussetzung: {
    stepId: "grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
    pageSchema: {
      eigeninitiativeGrundvorraussetzung: YesNoAnswer,
    },
  },
  eigeninitiativeGrundvorraussetzungHinweis: {
    stepId: "grundvoraussetzungen/eigeninitiative-grundvorraussetzung-hinweis",
  },
} as const satisfies PagesConfig;
