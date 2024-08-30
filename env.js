const config =
  process.env.NODE_ENV !== "production" ? await import("dotenv") : null;

export const PORT = process.env.PORT || 4001;
export const MONGO_STRING = process.env.MONGO_STRING || "";
