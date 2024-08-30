import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import Routes from "./routes/index.js";
import {
  MAIN_SITE_URL,
  ADMIN_PORTAL_FRONTEND_BASE_URL,
  MONGO_STRING,
  PORT,
} from "./env.js";
import mongoose from "mongoose";
import seeder from "./utils/helper/seeder.js";
import { registerSocketServer } from "./socketSever.js";

const allowedOrigins = [
  MAIN_SITE_URL,
  ADMIN_PORTAL_FRONTEND_BASE_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3003",
  "http://localhost:3005",
];
mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_STRING)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

const app = express();
const server = http.createServer(app);
registerSocketServer(server, allowedOrigins);

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  morgan(
    ":date[iso] - :req[X-Real-IP] - :method - :url - :status - :response-time ms"
  )
);
app.use("/api", Routes);
app.get("/api/health", (req, res) => {
  res.status(200).send("OKs");
});

// Seeding Endpoint
app.get("/api/seed-data", async (req, res) => {
  await seeder();
  res.status(200).json({ message: "Data Seeded Successfully" });
});
server.listen(PORT, () => console.log("Server Running on Port " + PORT));
