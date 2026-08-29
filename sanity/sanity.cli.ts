import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineCliConfig } from "sanity/cli";

// The CLI is invoked from inside the sanity/ folder by the `sanity:dev` script,
// so load the repository root `.env` explicitly (dotenv only reads process.cwd()).
loadEnv({ path: path.resolve(process.cwd(), "../.env") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
