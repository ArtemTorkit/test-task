import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

// Convert legacy configs to flat config format
const tsConfig = tseslint.configs.recommended.map((config) => {
  if (config.parserOptions) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parserOptions: config.parserOptions,
      },
    };
  }
  return config;
});

export default [
  // Global ignores
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js"],
  },

  // JavaScript configuration
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript configuration
  ...tsConfig,
 
  {
    files: ["**/*.{tsx,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: reactPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Prettier configuration (must be last)
  {
    ...prettier,
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
];
