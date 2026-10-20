import { resolve } from "node:path";
import { loadConfigForSections, ormConfigSection } from "@prisma/orm-toolchain/config-loader";
import { executeContractEmit } from "@prisma/orm-toolchain/cli/control-api";

const cwd = process.cwd();
const loaded = await loadConfigForSections(resolve(cwd, "prisma.config.ts"), [ormConfigSection]);

if (!loaded.ok) {
  console.error(loaded.failure);
  process.exit(1);
}

const result = await executeContractEmit({
  config: loaded.value,
  cwd,
  projectDir: cwd,
});

if (result.validationWarning) {
  console.warn(result.validationWarning);
}

if (result.sourceWarnings?.length) {
  console.warn(result.sourceWarnings);
}

console.log(
  JSON.stringify(
    {
      storageHash: result.storageHash,
      profileHash: result.profileHash,
      files: result.files,
    },
    null,
    2,
  ),
);
