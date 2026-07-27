import path from "path";
import { fileURLToPath } from "url";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// Allow all origins. CORS is a browser-enforced mechanism only — restricting
// origins here provides no real server-side security and causes 500 errors
// when the allowed-origin list doesn't exactly match what the browser sends.
app.use(
  cors({
    origin: true,   // reflect the request Origin header (allows any origin)
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// JSON error handler — must have 4 params so Express treats it as an error handler.
// Without this, Express falls back to its default HTML error page, which the
// browser shows as "Failed to fetch" / a 500 with no useful body.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

// Serve the built Meridian frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDir = path.resolve(__dirname, "../../meridian/dist/public");
  app.use(express.static(frontendDir));
  // Only fall back to index.html for non-API routes so unmatched /api/* requests
  // still return a proper 404 JSON response rather than silently returning HTML.
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDir, "index.html"));
  });
}

export default app;
