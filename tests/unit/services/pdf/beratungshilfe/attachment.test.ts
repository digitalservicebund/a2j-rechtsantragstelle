import { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  MARTIAL_STATUS_TITLE,
  createAttachment,
} from "~/services/pdf/beratungshilfe/attachment";

describe("createAttachment", () => {
  it("should add marital description in the attachment is bigger than 10 characters", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
    };

    const attachment = createAttachment(context);
    const hasMaritalDescription = attachment.descriptions.find(
      (description) => description.title === MARTIAL_STATUS_TITLE,
    );
    expect(hasMaritalDescription).toBeTruthy();
  });

  it("should not add marital description in the attachment is lower than 10 characters", () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "no",
    };

    const attachment = createAttachment(context);
    const hasMaritalDescription = attachment.descriptions.find(
      (description) => description.title === MARTIAL_STATUS_TITLE,
    );
    expect(hasMaritalDescription).toBeFalsy();
  });
});
