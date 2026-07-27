import path from "path";
import { fileURLToPath } from "url";
import express, { type Express } from "express";
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
// ALLOW_ORIGIN: comma-separated list of allowed origins for CORS.
// In production set this to the frontend URL (e.g. "https://adricprivate.com").
// Falls back to allow all origins when unset (useful for local dev).
const rawAllowOrigin = process.env.ALLOW_ORIGIN;
const allowedOrigins = rawAllowOrigin
  ? rawAllowOrigin.split(",").map((o) => o.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: allowedOrigins
      ? (origin, callback) => {
          // Allow server-to-server requests (no Origin header) and listed origins.
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: origin "${origin}" not allowed`));
          }
        }
      : true, // allow all when ALLOW_ORIGIN is not set
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

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
