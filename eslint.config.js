import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config({ ignores: ["dist", ".agents", ".claude"] }, prettierConfig, {
  extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2023,
    globals: globals.browser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    curly: ["error", "all"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": ["error", { code: 120 }],
    "padding-line-between-statements": ["error", { blankLine: "always", prev: "*", next: "return" }],
    "prefer-destructuring": [
      "error",
      { VariableDeclarator: { array: false, object: true }, AssignmentExpression: { array: false, object: false } },
    ],
  },
});
