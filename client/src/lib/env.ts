// Environment variable type definitions and validation
import { z } from "zod";

const envSchema = z.object({
  VITE_APP_URL: z.string().url().optional().default("http://localhost:5000"),
  VITE_API_URL: z.string().url().optional().default("http://localhost:5000/api"),
  VITE_BLOCKCHAIN_NODE: z.string().url().optional().default("http://localhost:8545"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  try {
    const parsed = envSchema.safeParse({
      VITE_APP_URL: import.meta.env.VITE_APP_URL,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_BLOCKCHAIN_NODE: import.meta.env.VITE_BLOCKCHAIN_NODE,
      NODE_ENV: import.meta.env.MODE,
    });

    if (!parsed.success) {
      console.warn(
        "⚠️ Using default environment variables:",
        parsed.error.flatten().fieldErrors,
      );
      // Return default values instead of throwing
      return envSchema.parse({});
    }

    return parsed.data;
  } catch (error) {
    console.warn("⚠️ Error parsing environment variables, using defaults");
    return envSchema.parse({});
  }
}

export const env = validateEnv();