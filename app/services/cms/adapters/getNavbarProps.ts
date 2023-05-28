import { NavbarPropsSchema } from "~/components/Navbar";
import type { Navigation } from "../models/Navigation";
import { removeEmpty } from "~/util/removeEmpty";

export const getNavbarProps = (cmsData: Navigation) => {
  return NavbarPropsSchema.parse(removeEmpty(cmsData));
};
