import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { createOpenApiDocument } from "../openapi.js";

const defaultOutputPath = "openapi.json";

async function main() {
  const requestedOutputPath = process.argv[2] ?? defaultOutputPath;
  const outputPath = path.resolve(process.cwd(), requestedOutputPath);
  const document = createOpenApiDocument({
    serverUrl: `http://localhost:${env.port}`,
  });

  await mkdir(path.dirname(outputPath), {
    recursive: true,
  });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);

  console.log(`[swagger] wrote ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Failed to generate OpenAPI spec.",
  );
  process.exitCode = 1;
});
