import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Experimental React 19 rule that flags legitimate data-fetching patterns.
      // Re-enable after migrating to React Query/SWR or server components.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
