import { z } from "zod";
import { StrapiCookieBannerSchema } from "./StrapiCookieBannerSchema";
import { StrapiFooterSchema } from "./StrapiFooter";
import { StrapiFormFlowPageSchema } from "./StrapiFormFlowPage";
import { StrapiPageSchema } from "./StrapiPage";
import { StrapiPageHeaderSchema } from "./StrapiPageHeader";
import { StrapiResultPageSchema } from "./StrapiResultPage";
import { StrapiTranslationSchema } from "./StrapiTranslations";
import { StrapiVorabCheckPageSchema } from "./StrapiVorabCheckPage";

export const StrapiFileContentSchema = z.object({
  "page-header": z.array(z.object({ attributes: StrapiPageHeaderSchema })),
  footer: z.array(z.object({ attributes: StrapiFooterSchema })),
  "cookie-banner": z.array(z.object({ attributes: StrapiCookieBannerSchema })),
  pages: z.array(z.object({ attributes: StrapiPageSchema })),
  "result-pages": z.array(z.object({ attributes: StrapiResultPageSchema })),
  "vorab-check-pages": z.array(
    z.object({ attributes: StrapiVorabCheckPageSchema }),
  ),
  "form-flow-pages": z.array(
    z.object({ attributes: StrapiFormFlowPageSchema }),
  ),
  translations: z.array(z.object({ attributes: StrapiTranslationSchema })),
});

export type StrapiFileContent = z.infer<typeof StrapiFileContentSchema>;
