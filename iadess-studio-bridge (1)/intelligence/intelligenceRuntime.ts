
let intelligenceTokens = 1500;

export function getTokens() {
  return intelligenceTokens;
}

export const getTokenLevel = getTokens;

export function consumeTokens(cost: number): boolean {
  if (intelligenceTokens < cost) {
    console.warn("SUBSTRATE_STARVATION: IQ-T depleted");
    return false;
  }
  intelligenceTokens -= cost;
  return true;
}

export function rewardTokens(amount: number) {
  intelligenceTokens += amount;
}

export function initializeIntelligence() {
  intelligenceTokens = 1500;
  console.log("INTELLIGENCE PROTOCOL ACTIVE — IQ-T =", intelligenceTokens);
}
