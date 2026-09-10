import { createContext } from "react-router";

// Populated in expressApp.ts's getLoadContext from Express's req.ip, which already
// accounts for the app's trusted proxy count (see `app.set("trust proxy", ...)`).
export const clientIpContext = createContext<string | undefined>();
