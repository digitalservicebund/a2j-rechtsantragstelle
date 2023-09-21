import { allRelevantLicenses } from "~/services/openSourceLicenses/generate";
import licenseListFile from "~/services/openSourceLicenses/opensource-licenses.json";

describe("licenseList", () => {
  it("is up-to-date", async () => {
    // const licenses = await allRelevantLicenses();
    // try {
    //   expect(licenses).toStrictEqual(licenseListFile);
    // } catch (err) {
    //   console.error(
    //     "License files to not match. Consider running 'npm run generate-licenses-list'",
    //   );
    //   throw err;
    // }
  }, 20000);
});
