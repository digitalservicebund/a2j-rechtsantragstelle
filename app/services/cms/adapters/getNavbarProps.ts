import { NavbarPropsSchema } from "~/components/Navbar";
import type { StrapiNavigation } from "../models/StrapiNavigation";
import { omitNull } from "~/util/omitNull";

export const getNavbarProps = (cmsData: StrapiNavigation) => {
  return NavbarPropsSchema.parse(omitNull(cmsData));
};
