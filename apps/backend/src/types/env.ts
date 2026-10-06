export type Env = {
  DB: D1Database;
  DOCUMENTS: R2Bucket;
  JWT_SECRET: string;
  AI?: any;
  GEMINI_API_KEY?: string;
};
