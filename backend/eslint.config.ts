import eslint           from "@eslint/js";
import eslintTsParser   from "@typescript-eslint/parser";
import eslintTs         from "typescript-eslint";
import globals          from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig ([
    eslint.configs.recommended,
    eslintTs.configs.recommendedTypeChecked,
    eslintTs.configs.strictTypeChecked,
    eslintTs.configs.stylisticTypeChecked,
    {    
        files: [ 
            "**/*.{js,mjs,cjs,ts,mts,cts}" 
        ],
        ignores: [

        ],
        languageOptions: {
            parser: eslintTsParser,
            parserOptions: {
                projectService: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ... globals.node,
                ... globals.es2022
            }
        },
    }
]);
