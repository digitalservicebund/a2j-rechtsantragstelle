import type { Preview } from "@storybook/react";
import "../app/styles.css";
import { sb } from "storybook/test";

sb.mock(import("../app/services/analytics/surveys/fetchSurveys.ts"), {
  spy: true,
});
sb.mock(import("../app/services/analytics/useAnalytics.ts"), {
  spy: true,
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    a11y: {
      options: {
        runOnly: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "best-practice",
          "wcag2aaa",
        ],
      },
      test: "error",
    },
  },
};

export default preview;
