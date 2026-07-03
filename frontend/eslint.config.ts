import eslint               from "@eslint/js";
import eslintReact          from "eslint-plugin-react"
import eslintReactHook      from "eslint-plugin-react-hooks";
import eslintReactCompiler  from "eslint-plugin-react-compiler";
import eslintTsParser       from "@typescript-eslint/parser";
import eslintTs             from "typescript-eslint";
import globals              from "globals";
import { defineConfig }     from "eslint/config";

export default defineConfig ([

    eslint.configs.recommended,
    eslintReact.configs.flat.recommended,
    eslintReact.configs.flat ["jsx-runtime"],
    eslintReactHook.configs.flat.recommended,
    eslintReactCompiler.configs.recommended,
    eslintTs.configs.recommendedTypeChecked,
    eslintTs.configs.strictTypeChecked,
    eslintTs.configs.stylisticTypeChecked,
    { 
        files: [ 
            "**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}" 
        ],
        ignores: [
            // "eslint.config.ts",
            // "prettier.config.ts"
        ],
        languageOptions: {
            parser: eslintTsParser,
            parserOptions: {
                projectService: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ... globals.browser,
                ... globals.es2022,
            }
        },
        settings: {
            react: {
                version: "detect"
            },
        },
}]);
