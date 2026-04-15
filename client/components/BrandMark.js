import Image from "next/image";
import Link from "next/link";
import { COMPANY_BRAND_NAME, COMPANY_TAGLINE } from "@/lib/site";

const variantClasses = {
  header: {
    wrapper: "gap-3",
    title: "max-w-[14rem] text-[0.92rem] leading-tight sm:max-w-[20rem] sm:text-[0.98rem] lg:max-w-[22rem]",
    tagline: "hidden",
  },
  footer: {
    wrapper: "gap-4",
    title: "max-w-[19rem] text-base leading-tight sm:max-w-[24rem] sm:text-lg",
    tagline: "hidden",
  },
};

export default function BrandMark({
  href = "/",
  variant = "header",
  tone = "auto",
  className = "",
}) {
  const styles = variantClasses[variant] ?? variantClasses.header;
  const textTone =
    tone === "light"
      ? "text-white"
      : "text-[color:var(--text-primary)]";
  const taglineTone =
    tone === "light"
      ? "text-white/70"
      : "text-[color:var(--text-secondary)]";

  const brand = (
    <div className={`flex items-center ${styles.wrapper} ${className}`.trim()}>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[color:var(--border)] bg-white/80 shadow-[color:var(--shadow-soft)] sm:h-12 sm:w-12">
        <Image
          src="/veagle-logo.webp"
          alt={COMPANY_BRAND_NAME}
          fill
          sizes="48px"
          className="object-contain p-1.5"
          unoptimized
        />
      </div>

      <div className="min-w-0">
        <p className={`font-headline tracking-tighter ${textTone} ${styles.title}`}>
          {COMPANY_BRAND_NAME}
        </p>
        {COMPANY_TAGLINE ? (
          <p className={`${styles.tagline} ${taglineTone}`.trim()}>
            {COMPANY_TAGLINE}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (!href) {
    return brand;
  }

  return (
    <Link href={href} className="group inline-flex items-center" aria-label={COMPANY_BRAND_NAME}>
      {brand}
    </Link>
  );
}
