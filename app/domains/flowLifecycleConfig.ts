import { type FlowId } from "./flowIds";

// Flow-specific session lifecycle overrides, in hours. Kept separate from the
// full `flows` registry in flows.server.ts (and its heavy domain imports) so
// lifecycleSession.ts - which session.server/index.ts depends on for every
// session read/write - doesn't create a circular import back through domain
// code that itself imports from ~/services/session.server.
export const flowLifecycleOverridesInHours: Partial<Record<FlowId, number>> = {
  "/geld-einklagen/formular": 720, // 30 days
};
