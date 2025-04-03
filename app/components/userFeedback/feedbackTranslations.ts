import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

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
export type FeedbackTranslationKeys = (typeof feedbackTranslationsKeys)[number];

const postSubmissionTranslationKeys = [
  "success-message",
  "feedback-helps",
  "text-post-submission",
] as const;
export type PostSubmissionTranslationKeys =
  (typeof postSubmissionTranslationKeys)[number];

const ratingBoxTranslationsKeys = ["yes-rating", "no-rating"] as const;
export type RatingBoxTranslationKeys =
  (typeof ratingBoxTranslationsKeys)[number];

export function useFeedbackTranslations() {
  const { feedback: translations } = useTranslations();

  return Object.fromEntries(
    [
      ...feedbackTranslationsKeys,
      ...postSubmissionTranslationKeys,
      ...ratingBoxTranslationsKeys,
    ].map((key) => [key, getTranslationByKey(key, translations)]),
  ) as Record<
    | FeedbackTranslationKeys
    | PostSubmissionTranslationKeys
    | RatingBoxTranslationKeys,
    string
  >;
}
