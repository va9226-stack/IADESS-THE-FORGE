
import { rewardTokens } from "../intelligence/intelligenceRuntime";

export function initializeForge() {
  console.log("FORGE BOOTSTRAP: Substrate initialized.");
  rewardTokens(100); // reward integrity for clean boot
}
