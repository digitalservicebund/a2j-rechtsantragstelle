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
    transport: {
      target: "pino-pretty", // Makes logs readable (optional)
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  });
};
