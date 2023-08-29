import { z } from "zod";

export const PageHeaderPropsSchema = z.object({
  title: z.string(),
  linkLabel: z.string(),
});
type PageHeaderProps = z.infer<typeof PageHeaderPropsSchema>;

export default function Header({ title, linkLabel }: PageHeaderProps) {
  return (
    <header className="py-20 px-16">
      <a
        href="/"
        className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4"
        aria-label={linkLabel}
      >
        {title}
      </a>
    </header>
  );
}
