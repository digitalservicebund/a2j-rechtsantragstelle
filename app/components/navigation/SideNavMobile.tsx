import MenuIcon from "@digitalservicebund/icons/Menu";

type SideNavMobileProps = Readonly<{
  className?: string;
  label: string;
  currentPageTitle: string;
}>;

export default function SideNavMobile(props: SideNavMobileProps) {
  return (
    <button
      type="button"
      className={`flex flex-wrap items-center justify-start gap-8 text-sm py-16 px-10 bg-white border-[1px] border-blue-400 ${props.className ?? ""}`}
    >
      <MenuIcon className={"!h-[24px] !w-[24px]"} />
      <span>
        {props.label}:
        <span className={"font-semibold"}> {props.currentPageTitle} </span>
      </span>
    </button>
  );
}
