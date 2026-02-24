import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, "../../.env");
const PORT = 3000;

const getLocalIP = (): string | null => {
  const interfaces = networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    if (!networkInterface) continue;

    for (const info of networkInterface) {
      if (info.family === "IPv4" && !info.internal) {
        return info.address;
      }
    }
  }

  return null;
};

const updateEnvFile = (backendUrl: string): void => {
  let envContent = "";

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, "utf-8");
  } else {
    console.warn(".env not found, a new one will be created.");
  }

  const variableName = "EXPO_PUBLIC_APP_URL";
  const newValue = backendUrl;
  const envVarRegex = new RegExp(`^${variableName}=.*`, "m");

  const updatedEnv = envContent.match(envVarRegex)
    ? envContent.replace(envVarRegex, `${variableName}=${newValue}`)
    : `${envContent}${envContent ? "\n" : ""}${variableName}=${newValue}`;

  writeFileSync(envPath, `${updatedEnv.trim()}\n`, "utf-8");
  console.log(`${variableName} updated to: ${newValue}`);
};

const main = (): void => {
  const ip = getLocalIP();

  if (!ip) {
    console.error(
      "Could not determine local IP address. Make sure you are connected to a network.",
    );
    process.exit(1);
  }

  const backendUrl = `http://${ip}:${PORT}`;
  console.log(`Found Local IP: ${ip}`);

  updateEnvFile(backendUrl);
};

main();
