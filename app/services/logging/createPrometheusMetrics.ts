import { register, Histogram, Counter } from "prom-client";
import type { Request, Response, NextFunction } from "express";
import { isbot } from "isbot";

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
  "/ENV",
  "/actuator",
  "/admin",
];

// Prometheus histogram metric for HTTP requests
const httpRequestHistogram = new Histogram({
  name: "a2j_http_request_duration_seconds",
  help: "A2J - HTTP request latency in seconds",
  labelNames: ["method", "path"],
  registers: [register],
});

// Prometheus counter metric for total HTTP requests
const httpRequestCounterByClient = new Counter({
  name: "a2j_http_requests_by_client_total",
  help: "A2J - Total HTTP requests by client",
  labelNames: ["statusCode", "browser", "device"],
  registers: [register],
});

// Prometheus counter metric for total HTTP requests
const httpRequestCounterByPath = new Counter({
  name: "a2j_http_requests_by_path_total",
  help: "A2J - Total HTTP requests by path",
  labelNames: ["statusCode", "method", "path"],
  registers: [register],
});

const isIgnoredPath = (url: string): boolean => {
  return IGNORED_PATHS.some((prefix) => url.startsWith(prefix));
};

const sanitizePath = (path: string): string => {
  return (
    path
      // Remove query parameters
      .split("?")[0]
      // Remove numbers
      .replaceAll(/\d+/g, "")
      // Remove special characters except forward slashes and hyphens
      .replaceAll(/[^a-zA-Z\-/]/g, "")
      // Clean up multiple consecutive slashes
      .replaceAll(/\/+/g, "/")
      // Remove trailing slash (except for root path)
      .replaceAll(/\/$/g, "") || "/"
  );
};

type UserAgentInfo = {
  browser: string;
  device: "mobile" | "desktop" | "unknown";
};

const apiClientPatterns =
  /curl|wget|python-requests|axios|postman|thunder|insomnia|restclient|fetch|httpclient/i;

const mobilePatterns =
  /mobile|android|iphone|ipad|ipod|windows phone|blackberry|opera mini|kindle/i;

const parseUserAgent = (userAgent: string): UserAgentInfo => {
  if (!userAgent) {
    return {
      browser: "unknown",
      device: "unknown",
    };
  }

  const ua = userAgent.toLowerCase();
  // Detect device type
  const device = mobilePatterns.test(ua) ? "mobile" : "desktop";

  // Detect browser
  let browser = "other";
  if (isbot(ua)) {
    browser = "bot";
  } else if (/edg/.test(ua)) {
    browser = "edge";
  } else if (/chrome/.test(ua)) {
    browser = "chrome";
  } else if (/firefox/.test(ua)) {
    browser = "firefox";
  } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
    browser = "safari";
  } else if (/opera|opr/.test(ua)) {
    browser = "opera";
  } else if (apiClientPatterns.test(ua)) {
    browser = "api-client";
  }

  return {
    browser,
    device,
  };
};

const normalizeStatusCode = (statusCode: number): string => {
  return `${Math.floor(statusCode / 100)}xx`;
};

const initializeMetrics = () => {
  // Initialize histogram with common paths and methods
  const commonPaths = ["/", "/login", "/dashboard", "/api"];
  const commonMethods = ["GET", "POST"];

  commonPaths.forEach((path) => {
    commonMethods.forEach((method) => {
      httpRequestHistogram.labels(method, path).observe(0);
    });
  });

  // Initialize counters with common label combinations
  const statusCodes = ["2xx", "3xx", "4xx", "5xx"];
  const browsers = [
    "chrome",
    "firefox",
    "safari",
    "edge",
    "bot",
    "api-client",
    "other",
  ];
  const devices = ["mobile", "desktop"];

  statusCodes.forEach((code) => {
    browsers.forEach((browser) => {
      devices.forEach((device) => {
        httpRequestCounterByClient.labels(code, browser, device).inc(0);
      });
    });
  });

  statusCodes.forEach((code) => {
    commonMethods.forEach((method) => {
      commonPaths.forEach((path) => {
        httpRequestCounterByPath.labels(code, method, path).inc(0);
      });
    });
  });
};

export const createPrometheusMetricsMiddleware = () => {
  // Initialize metrics with expected label values
  initializeMetrics();

  return async (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Handle metrics endpoint
    if (req.url === "/metrics") {
      res.set("Content-Type", register.contentType);
      const metrics = await register.metrics();
      res.end(metrics);
      return;
    }

    // Skip metrics collection for ignored paths
    if (isIgnoredPath(req.url)) {
      next();
      return;
    }

    // Record metrics on response finish
    res.on("finish", () => {
      // Skip recording metrics for 302 redirect responses
      if (res.statusCode === 302) {
        return;
      }

      const duration = (Date.now() - start) / 1000;
      const userAgent = req.headers["user-agent"] || "unknown";
      const userAgentInfo = parseUserAgent(userAgent);

      const labels = {
        method: req.method,
        path: sanitizePath(req.path),
        statusCode: normalizeStatusCode(res.statusCode),
        browser: userAgentInfo.browser,
        device: userAgentInfo.device,
      };

      httpRequestHistogram.labels(labels.method, labels.path).observe(duration);
      httpRequestCounterByClient
        .labels(labels.statusCode, labels.browser, labels.device)
        .inc();
      httpRequestCounterByPath
        .labels(labels.statusCode, labels.method, labels.path)
        .inc();
    });

    next();
  };
};
