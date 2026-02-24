import { networkInterfaces } from "node:os";

export const getLocalIPs = (): string[] => {
  const interfaces = networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    if (!networkInterface) continue;

    for (const info of networkInterface) {
      if (info.family === "IPv4" && !info.internal) {
        ips.push(info.address);
      }
    }
  }

  return ips;
};

export const getLocalIP = (): string | null => {
  const ips = getLocalIPs();
  return ips.length > 0 ? (ips[0] ?? null) : null;
};
