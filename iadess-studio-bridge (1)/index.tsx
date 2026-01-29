
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeIntelligence } from "./intelligence/intelligenceRuntime";
import { initializeForge } from "./core/forgeBootstrap";
import { registerSystemIdentity } from "./index/systemIdentity";
import { bootstrapEnvironment } from "./index/bootstrapEnv";

// 1. Bootstrap Environment
bootstrapEnvironment();

// 2. Bring Intelligence Online
initializeIntelligence();

// 3. Register System Identity + Protocols
registerSystemIdentity();

// 4. Initialize Forge Substrate
initializeForge();

// 5. Mount UI
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log("IADESS SYSTEM ONLINE :: INTEGRITY MODE ACTIVE");
