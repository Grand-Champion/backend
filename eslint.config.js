import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

// Load .gitignore patterns to exclude from linting
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
    // Automatically ignore files listed in .gitignore
    includeIgnoreFile(gitignorePath),
    // Apply ESLint's recommended JavaScript rules
    js.configs.recommended,
    // Disable ESLint rules that conflict with Prettier
    prettier,
    {
        // Define global variables available in browser and Node.js
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            // ============================================
            // BASE JAVASCRIPT/TYPESCRIPT RULES
            // ============================================
            // TypeScript handles undefined variables better than ESLint
            'no-undef': 'off',

            // ============================================
            // CODE STYLE & NAMING CONVENTIONS
            // ============================================
      
            // Enforce 4-space indentation
            'indent': ['warn', 4, {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1
            }],
            // Prefer camelCase but allow snake_case in object properties (for APIs)
            'camelcase': ['warn', { properties: 'never', ignoreDestructuring: true }],
            // Functions must return consistently (all paths return or none do)
            'consistent-return': 'error',
            // Use const when variables aren't reassigned
            'prefer-const': 'error',
            // No var keyword - use let or const
            'no-var': 'error',
            // Use shorthand object properties: { name } instead of { name: name }
            'object-shorthand': ['error', 'always'],
            // Use template literals instead of string concatenation
            'prefer-template': 'warn',
            // Use arrow functions for callbacks
            'prefer-arrow-callback': 'warn',
            // Avoid nested ternaries - they're hard to read
            'no-nested-ternary': 'warn',
            // Simplify unnecessary ternaries: x ? true : false → !!x
            'no-unneeded-ternary': 'error',

            // ============================================
            // BEST PRACTICES
            // ============================================
            // Only allow console.warn and console.error (remove console.log before production)
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            // Avoid alert() - use proper UI notifications
            'no-alert': 'warn',
            // Never use eval() - security risk
            'no-eval': 'error',
            // No eval-like functions (setTimeout with string, etc.)
            'no-implied-eval': 'error',
            // No new Function() constructor - similar to eval
            'no-new-func': 'error',
            // Don't reassign function parameters (except their properties)
            'no-param-reassign': ['error', { props: false }],
            // Avoid redundant return await
            'no-return-await': 'error',
            // Functions marked async should actually use await
            'require-await': 'warn',
            // Disallow unused expressions except short-circuit and ternary
            'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
            // Always use === and !== (except for null checks)
            'eqeqeq': ['error', 'always', { null: 'ignore' }],
            // Always use curly braces for if/else/for/while
            'curly': ['error', 'all'],
            // Prefer dot notation over bracket notation when possible
            'dot-notation': 'error',
            // Remove unnecessary else blocks after return
            'no-else-return': 'error',
            // Avoid lonely if inside else block - use else if
            'no-lonely-if': 'error',
            // Remove unnecessary return statements
            'no-useless-return': 'error',
            // Always reject promises with Error objects
            'prefer-promise-reject-errors': 'error',
            // Always specify radix in parseInt()
            'radix': 'error',
            // Avoid Yoda conditions: if ('red' === color) → if (color === 'red')
            'yoda': 'error',

            // ============================================
            // ERROR PREVENTION
            // ============================================
            // Catch x === x comparisons (likely a mistake)
            'no-self-compare': 'error',
            // Warn about ${...} in regular strings (should be template literal)
            'no-template-curly-in-string': 'warn',
            // Catch loops that can only run once
            'no-unreachable-loop': 'error',
            // Array methods like map/filter must return a value
            'array-callback-return': 'error',
            // Constructors shouldn't return values
            'no-constructor-return': 'error',
            // Promise executor shouldn't return values
            'no-promise-executor-return': 'error',
            // Avoid await inside loops (usually should use Promise.all)
            'no-await-in-loop': 'warn',

            // ============================================
            // IMPORT/EXPORT RULES
            // ============================================
            // Prevent importing from index files (can cause circular dependencies)
            'no-restricted-imports': ['error', {
                patterns: ['../**/index']
            }],
            // Sort imports alphabetically within groups
            'sort-imports': ['error', {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
            }]
        }
    },
    // ============================================
    // RELAXED RULES FOR SPECIFIC FILE TYPES
    // ============================================
    {
        // Test files can be more flexible with types and logging
        files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
        rules: {
            // Allow console.log for debugging tests
            'no-console': 'off'
        }
    },
    {
        // Config files often need console output and flexible typing
        files: ['**/*.config.js', '**/*.config.ts'],
        rules: {
            // Config files often log build information
            'no-console': 'off'
        }
    },
);