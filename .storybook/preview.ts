import type { Preview } from "@storybook/react-vite";
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
  },
};

export default preview;
