import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Logo from "@/components/Logo";

export default function ContactLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader>
        <Logo />
      </SiteHeader>
      <div className="flex-grow">{children}</div>
      <SiteFooter />
    </>
  );
}
