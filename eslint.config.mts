// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
//   { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ]);

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  //   tseslint.configs.recommended
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules : {
        "no-console" : "warn",
        // "@typescript-eslint/no-dynamic-delete": "error"
    }
  }
);