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
};

export default config;
