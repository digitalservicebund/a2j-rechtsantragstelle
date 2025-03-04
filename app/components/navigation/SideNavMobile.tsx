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
    <div className={props.className}>
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <label
        htmlFor="menu-toggle"
        className={`flex gap-8 text-sm py-16 px-10 bg-white cursor-pointer`}
      >
        <MenuIcon className="!h-[24px] !w-[24px]" />
        <span>
          {props.label}:{" "}
          <span className="font-semibold">{props.currentPageTitle}</span>
        </span>
      </label>
      <div className="w-full hidden peer-checked:block bg-white">
        <NavigationList navItems={props.navItems} />
      </div>
    </div>
  );
}
