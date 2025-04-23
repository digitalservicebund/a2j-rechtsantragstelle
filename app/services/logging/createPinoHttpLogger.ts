import { pinoHttp } from "pino-http";

export const createPinoHttpLogger = () => {
  return pinoHttp({
    autoLogging: {
      ignore: (req) =>
        (req.url ?? "").startsWith("/assets/") ||
        (req.url ?? "").startsWith("/app/") ||
        (req.url ?? "").startsWith("/@") ||
        (req.url ?? "").startsWith("/node_modules/") ||
        (req.url ?? "").startsWith("/data/"),
    },
    customLogLevel: function (req, res, err) {
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
    },
  });
};
