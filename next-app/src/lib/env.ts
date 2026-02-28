/**
 * Validates that required environment variables are present.
 * Call this in the pipeline before the first API call, not at module load time,
 * to allow tests to run without keys.
 */
export function validateEnv() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is required');
  if (!process.env.PEXELS_API_KEY) throw new Error('PEXELS_API_KEY is required');
}
