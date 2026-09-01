import Image from "next/image";
import Link from "next/link";
import { getCompanyProfile, imageUrl } from "@/lib/sanity/data";

/** Header brand logo — pulled from Sanity (companyProfile.logo), with a text
 *  fallback when no logo has been uploaded yet. Server component: best-effort. */
export default async function Logo() {
  const profile = await getCompanyProfile();
  const logoUrl = profile?.logo ? imageUrl(profile.logo) : null;
  const alt = profile?.logo?.alt || profile?.companyName || "Green Property";

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
      <Image
        src={logoUrl}
        alt={alt}
        width={160}
        height={48}
        priority
        unoptimized={false}
        className="notranslate h-12 w-auto object-contain text-transparent"
      />
    </Link>
  );
}