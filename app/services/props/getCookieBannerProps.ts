import { omitNull } from "~/util/omitNull";
import {
  type StrapiCookieBanner,
  StrapiCookieBannerSchema,
} from "~/services/cms/models/StrapiCookieBannerSchema";

export const getCookieBannerProps = (cmsData: StrapiCookieBanner) => {
  return StrapiCookieBannerSchema.parse(omitNull(cmsData));
};
