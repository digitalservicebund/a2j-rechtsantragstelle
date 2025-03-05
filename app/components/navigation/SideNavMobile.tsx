import Close from "@digitalservicebund/icons/Close";
import MenuIcon from "@digitalservicebund/icons/Menu";
import { NavigationList } from "~/components/navigation/NavigationList";
import { NavItem } from "~/components/navigation/NavItem";

type SideNavMobileProps = Readonly<{
  className?: string;
  label: string;
  currentPageTitle: string;
  navItems: NavItem[];
}>;

export default function SideNavMobile(props: SideNavMobileProps) {
  return (
    <div className={props.className ?? ""}>
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <label
        htmlFor="menu-toggle"
        className="bg-black h-screen opacity-70 hidden peer-checked:block"
        data-testid="close-overlay"
        aria-label="Close menu"
      >
        <span className="sr-only">Close menu</span>
      </label>

      <MenuIcon className="inline-flex peer-checked:hidden pl-10 h-[52px] w-1/12 bg-white cursor-pointer text-blue-800" />
      <Close className="hidden peer-checked:inline-flex pl-10 h-[52px] w-1/12 bg-white cursor-pointer text-blue-800" />

      <label
        htmlFor="menu-toggle"
        aria-label="Main menu toggle"
        className="inline-flex gap-8 text-sm py-16 px-10 bg-white cursor-pointer w-11/12"
      >
        <span>
          {props.label}:
          <span className="font-semibold ml-4">{props.currentPageTitle}</span>
        </span>
      </label>

      <div className="w-full hidden peer-checked:block bg-white pb-10">
        <div className="bg-white border border-blue-400 mx-10 mb-10">
          <NavigationList navItems={props.navItems} />
        </div>
      </div>
    </div>
  );
}
