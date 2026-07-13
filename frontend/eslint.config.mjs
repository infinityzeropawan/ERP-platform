import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // API response payloads are intentionally dynamic at integration boundaries.
      "@typescript-eslint/no-explicit-any": "off",
      // Data fetching in effects is used throughout the client pages.
      "react-hooks/set-state-in-effect": "off",
      // Small render-local field components do not retain state.
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "backend/dist/**",
    "backend/node_modules/**",
  ]),
]);

export default eslintConfig;
