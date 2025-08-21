import type { GenericGuard } from "~/domains/guards.server";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import type { BeratungshilfeFinanzielleAngabenUserData } from "./userData";

export type BeratungshilfeFinanzielleAngabenGuard = GenericGuard<
  BeratungshilfeFinanzielleAngabenUserData &
    BeratungshilfeFinanzielleAngabenEinkommenUserData
>;
