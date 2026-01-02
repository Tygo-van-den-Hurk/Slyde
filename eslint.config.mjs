import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from "eslint-config-prettier";
import { jsdoc } from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-import';


/**
 * The config for ESlint. A JavaScript, and TypeScript linter.
 * I've set it to the strictest settings to ensure you catch
 * as many real bugs, and follow as many good practices as
 * humanly possible.
 */
export default defineConfig(
  eslint.configs.all,
  tseslint.configs.all,
  {
    files: [ 'browser/**/*.ts', 'src/**/*.ts', 'lib/**/*.ts'],
    extends: [
      importPlugin.flatConfigs.recommended, 
      importPlugin.flatConfigs.typescript
    ],
    rules: {
      "import/no-cycle": ["error", { 
        maxDepth: Infinity,
        ignoreExternal: true 
      }],

      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
      "import/no-default-export": "error",
      "import/no-extraneous-dependencies": ["error", {
        devDependencies: [
          "**/*.test.ts",
          "**/*.spec.ts",
          "**/test/**",
          "**/*.config.*"
        ]
      }],
      "import/no-webpack-loader-syntax": "error",
      "import/no-self-import": "error",
    }
  },
  jsdoc({
    config: "flat/recommended",
    files: [ 'browser/**/*.ts', 'src/**/*.ts', 'lib/**/*.ts'],
    rules: {
      "jsdoc/require-description": "error",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-yields": "off",
      "jsdoc/require-jsdoc": [
        "error",
        {
          "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ClassDeclaration": true,
            "ArrowFunctionExpression": true,
            "FunctionExpression": true,
            "ClassExpression": true,
          },
          publicOnly: true,
          enableFixer: false,
          "contexts": [
            "ExportNamedDeclaration",
            "ExportDefaultDeclaration"
          ],
        },
      ],
    },
  }),
  {
    ignores: [ 'node_modules', 'dist', './*.config.*js' ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ArrowFunctionExpression[body.type='BlockStatement'][body.body.length>1]",
          message: "Arrow functions must have a single-line body."
        },
      ],
      "no-continue": "off",
      "one-var": "off",
      '@typescript-eslint/naming-convention': [
        'error',
        {
          "selector": "classProperty",
          "modifiers": ["static", "readonly"],
          "format": ["UPPER_CASE"],
        },
      ],
      "max-statements": ["error", 15],
      "@typescript-eslint/no-magic-numbers": [ "error", { "ignore": [0, 1] }, ],  
      "lines-around-comment": [
        "error",
        {
          "beforeBlockComment": false,
        }
      ],
    },
  },
  //
  // Making tests files use less strict linting
  //
  {
    // Since test functions are not for production, we can use unsafe things,
    // if they fail that is even better.
    files: ['test/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      "no-unsafe-type-assertion": "off", 
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "max-lines-per-function": "off",
      "no-plusplus": "off"
    },
  },
  //
  // FORMATTING
  //
  prettier,
);