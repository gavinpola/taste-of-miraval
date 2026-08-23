// Spawns the server over stdio and verifies it initializes and lists tools.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/index.ts"],
});
const client = new Client({ name: "smoke-test", version: "0.0.0" });

await client.connect(transport);
const { tools } = await client.listTools();
console.log(`OK: server exposes ${tools.length} tools`);
for (const t of tools) console.log(`  - ${t.name}`);
await client.close();
