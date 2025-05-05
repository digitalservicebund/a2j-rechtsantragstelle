import { pinoHttp } from "pino-http";

const IGNORED_PATHS = [
  "/assets/",
  "/app/",
  "/@",
  "/node_modules/",
  "/site.webmanifest",
  "/favicon",
  "/health",
  "/data/",
  "/apple",
  "/__manifest",
  "/.well-known/",
];

export const createPinoHttpLogger = () => {
  return pinoHttp({
    autoLogging: {
      ignore: (req) =>
        IGNORED_PATHS.some((prefix) => (req.url ?? "").startsWith(prefix)),
    },
    customLogLevel: function (_req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return "silent";
      }
      return "info";
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"],
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
      err: (err) => (err ? { message: err.message, stack: err.stack } : err),
    },
  });
};
