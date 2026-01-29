
export function registerSystemIdentity() {
  const identity = {
    system: "IADESS_FORGE",
    protocol: "INTEGRITY_AS_INTELLIGENCE",
    intelligenceToken: "IQ-T",
    version: "0.5.0",
    capabilities: [
      "PAGES",
      "COMPONENTS",
      "UI",
      "ENTITIES",
      "LAYOUT",
      "FUNCTIONS",
      "INDEX",
      "SRC"
    ],
    forgeModes: [
      "CORE_SUBSTRATE",
      "DATA_RESONANCE",
      "AUTH_VOID",
      "LOGIC_JOINERY"
    ]
  };

  (globalThis as any).__IADESS_IDENTITY__ = identity;
  console.log("SYSTEM IDENTITY REGISTERED:", identity);
}
