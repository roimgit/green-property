import Link from "next/link";
import LogoImage from "@/components/LogoImage";
import { getCompanyProfile, imageUrl } from "@/lib/sanity/data";

/** Header brand logo — pulled from Sanity (companyProfile.logo), with a text
 *  fallback when no logo has been uploaded yet. Server component: best-effort. */
export default async function Logo() {
  const profile = await getCompanyProfile();
  const logo = profile?.logo;
  const logoUrl = logo ? imageUrl(logo) : null;
  const alt = logo?.alt || profile?.companyName || "Green Property";

  // Display height is 48px; derive width from the real aspect ratio so the
  // <Image> geometry never distorts or letterboxes the uploaded logo.
  const HEIGHT = 48;
  const dims = logo?.asset?.metadata?.dimensions;
  const width =
    dims?.width && dims?.height
      ? Math.max(48, Math.round((dims.width / dims.height) * HEIGHT))
      : 160;

  if (!logoUrl) {
    return (
      <Link
        href="/"
        translate="no"
        className="notranslate font-headline-md text-headline-md font-bold text-primary hover:text-primary/80 transition-colors"
      >
        Green Property
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center" translate="no">
      <LogoImage src={logoUrl} alt={alt} width={width} height={HEIGHT} />
    </Link>
  );
}