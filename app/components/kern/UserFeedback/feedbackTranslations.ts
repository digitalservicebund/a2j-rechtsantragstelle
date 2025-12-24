import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { translations } from "~/services/translations/translations";

const feedbackTranslationsKeys = [
  "heading-feedback",
  "success-message",
  "positive-feedback-question",
  "negative-feedback-question",
  "heading-personal-data-feedback",
  "placeholder-feedback",
  "submit-button-feedback",
  "antwort-uebermittelt",
  "feedback-helps",
  "report-problem",
  "cancel",
  "submit-problem",
  "close",
  "open-feedback-placeholder",
] as const;
type FeedbackTranslationKeys = (typeof feedbackTranslationsKeys)[number];

const postSubmissionTranslationKeys = [
  "success-message",
  "feedback-helps",
  "text-post-submission",
] as const;
type PostSubmissionTranslationKeys =
  (typeof postSubmissionTranslationKeys)[number];

const ratingBoxTranslationsKeys = ["yes-rating", "no-rating"] as const;
type RatingBoxTranslationKeys = (typeof ratingBoxTranslationsKeys)[number];

export function useFeedbackTranslations() {
  const feedbackTranslations = Object.fromEntries(
    Object.entries(translations.feedback).map(([key, value]) => [
      key,
      value[defaultLocale],
    ]),
  );
  return Object.fromEntries(
    [
      ...feedbackTranslationsKeys,
      ...postSubmissionTranslationKeys,
      ...ratingBoxTranslationsKeys,
    ].map((key) => [key, getTranslationByKey(key, feedbackTranslations)]),
  ) as Record<
    | FeedbackTranslationKeys
    | PostSubmissionTranslationKeys
    | RatingBoxTranslationKeys,
    string
  >;
}
