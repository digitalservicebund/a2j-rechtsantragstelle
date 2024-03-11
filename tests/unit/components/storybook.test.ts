import initStoryshots from "@storybook/addon-storyshots";

initStoryshots({
  // excluded stories by story title (= kind):
  storyKindRegex: /^((?!.*?Component\/(DateInput|TimeInput)).)*$/,
});
