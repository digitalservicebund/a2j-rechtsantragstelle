import type { KnipConfig } from "knip";

const cssCompiler = (code: string): string => {
  // Regex to match CSS at-rules that can reference deps
  const dependencyPattern = /@(import|plugin|config)\s+["']([^"']+)["']/g;

  // Find all matches (e.g., @import "package")
  const matches = Array.from(code.matchAll(dependencyPattern));

  // Important: convert each match into a fake JS import Knip can understand
  const imports = matches.map(([, , dependencyPath]) => {
    return `import "${dependencyPath}";`;
  });

  return imports.join("\n");
};

const config: KnipConfig = {
  project: [
    "app/**/*.{ts,tsx,css}",
    "tests/**/*.{ts,tsx}",
    "scripts/**/*.ts",
    "stories/**/*.tsx",
  ],
  eslint: {
    config: "eslint.config.js",
  },
  oxlint: {
    config: ".oxlintrc.json",
  },
  compilers: {
    css: cssCompiler,
  },
  "react-router": {
    config: ["react-router.config.ts", "vite.config.ts"],
  },
  // Info: Knip reports unlisted dependencies coming from @vitest/coverage-v8
  // we are using istanbul for the coverage
  ignoreDependencies: ["@vitest/coverage-v8"],
  // Info: Knip reports unresolved imports coming from root.tsx.
  // These +types/root and .react-router/types are intentionally git-ignored
  // and generated at build/dev time
  ignoreUnresolved: [/^\.?\/\+types\/root$/, /react-router\/types$/],
};

export default config;
