import { NavbarPropsSchema } from "~/components/Navbar";
import type { Navigation } from "../models/Navigation";
import { omitNull } from "~/util/omitNull";

export const getNavbarProps = (cmsData: Navigation) => {
  return NavbarPropsSchema.parse(omitNull(cmsData));
};
