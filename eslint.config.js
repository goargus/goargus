import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin"; 

export default [
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tsParser, 
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tsPlugin, 
    },
    rules: {
      ...vue.configs.base.rules,
      "vue/multi-word-component-names": "off",
      "vue/comment-directive": "off",
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["error"] }],
    },
  },
];
