import {
  ArrowUpRight,
  AtSign,
  Clock3,
  Compass,
  Eye,
  MailCheck,
  MapPin,
  Network,
  Phone,
  TerminalSquare,
} from "lucide-react";

import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { SecondaryLink, pageClass, pageHeroTitleClass } from "@/components/site/UiBits";
import {
  COMPANY_ADDRESS,
  COMPANY_ADDRESS_QUERY,
  COMPANY_EMAIL,
  COMPANY_MAP_EMBED_URL,
  COMPANY_PHONE,
  COMPANY_PHONE_LINK,
} from "@/lib/site";

const enquiryChecklist = [
  {
    title: "Project Goals",
    description:
      "Share what you want to launch, improve or automate so we can suggest the right next step.",
    icon: TerminalSquare,
  },
  {
    title: "Required Services",
    description:
      "Tell us if you need website development, software, ERP, SEO, design, outsourcing or a custom combination.",
    icon: Network,
  },
  {
    title: "Timeline and Budget",
    description:
      "Add expected timeline, budget range and any business constraints we should keep in mind.",
    icon: Clock3,
  },
];

const responseSteps = [
  {
    title: "Requirement Review",
    description:
      "We review your requirement to understand scope, business goals and technical fit.",
    icon: Eye,
    iconColor: "text-[color:var(--accent)]",
  },
  {
    title: "Solution Planning",
    description:
      "We recommend the right website, software, ERP or marketing approach for your use case.",
    icon: Compass,
    iconColor: "text-[color:var(--accent-success)]",
  },
  {
    title: "Response and Proposal",
    description:
      "You receive a clear response with deliverables, discussion points and execution direction.",
    icon: MailCheck,
    iconColor: "text-[color:var(--accent)]",
  },
];

function renderHeroTitle(value) {
  const title =
    value ||
    "Website development, software, ERP, digital marketing and business support services in one place";

  return title.split(/(website|software|digital marketing)/gi).map((part, index) => {
    const key = `${part}-${index}`;
    const lowered = part.toLowerCase();

    if (lowered === "website" || lowered === "software") {
      return (
        <span key={key} className="text-[color:var(--accent)]">
          {part}
        </span>
      );
    }

    if (lowered === "digital marketing") {
      return (
        <span key={key} className="text-[color:var(--accent-success)]">
          {part}
        </span>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function toAddressLines(address) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 3) {
    return parts;
  }

  return [
    parts.slice(0, 3).join(", "),
    parts.slice(3, 6).join(", "),
    parts.slice(6).join(", "),
  ].filter(Boolean);
}

export default function ContactPageContent({ content, services = [] }) {
  const contact = content?.contact || {};
  const contactEmail = contact.email || COMPANY_EMAIL;
  const contactPhone = contact.phone || COMPANY_PHONE;
  const contactPhoneLink = contact.phone
    ? `tel:${String(contact.phone).replace(/[^\d+]/g, "")}`
    : COMPANY_PHONE_LINK;
  const contactAddress = COMPANY_ADDRESS;
  const contactAddressQuery = COMPANY_ADDRESS_QUERY;
  const officeMapEmbedUrl = COMPANY_MAP_EMBED_URL;
  const serviceOptions = services.map((service) => ({
    value: service.title,
    label: service.title,
  }));
  const addressLines = toAddressLines(contactAddress);

  return (
    <main className={pageClass}>
      <section className="relative overflow-hidden bg-[#0c0e18] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        {/* Background Accents for Dark Hero */}
        <div className="veagle-section-wash" />
        <div className="veagle-grid-background pointer-events-none opacity-40" />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/80 via-transparent to-[#0c0e18]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),transparent_40%)]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">
                Contact Veagle Space
              </span>
            </div>
            <h1 className={`mt-7 max-w-5xl ${pageHeroTitleClass} text-white`}>
              {renderHeroTitle(contact.title)}
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-blue-100/70">
              {contact.description ||
                "Tell us about your requirement and our team will help you shape the right website, software, ERP or digital growth solution."}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pb-12 lg:pt-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-5 lg:pt-4">
            <div>
              <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
                What to Share
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                To help us respond faster and more clearly, include the following details in your inquiry:
              </p>
            </div>

            <ul className="grid gap-4">
              {enquiryChecklist.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li key={item.title} className="group">
                    <article className="relative overflow-hidden rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.42)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]">
                      <div className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.45),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="absolute -right-8 top-3 h-24 w-24 rounded-full bg-[color:var(--accent)]/8 blur-2xl transition duration-300 group-hover:bg-[color:var(--accent)]/15" />

                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--accent)] transition duration-300 group-hover:scale-105 group-hover:border-[color:var(--accent)]/35 group-hover:bg-[color:var(--accent)] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--accent)]">
                                {`0${index + 1}`}
                              </p>
                              <p className="mt-2 font-headline text-base font-black tracking-tight text-[color:var(--text-primary)]">
                                {item.title}
                              </p>
                            </div>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--accent)]" />
                          </div>

                          <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)] transition-colors duration-300 group-hover:text-[color:var(--text-secondary)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-[1.2rem] border border-white/10 bg-[color:var(--surface-strong)] p-6 backdrop-blur-md">
              <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                Direct Contact
              </h3>
              <div className="mt-6 space-y-5">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-4 transition hover:opacity-90"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-muted)]">
                    <AtSign className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      Email
                    </p>
                    <p className="mt-1 break-all text-base font-medium text-[color:var(--text-primary)]">
                      {contactEmail}
                    </p>
                  </div>
                </a>
                <a
                  href={contactPhoneLink}
                  className="flex items-start gap-4 transition hover:opacity-90"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-muted)]">
                    <Phone className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      Phone
                    </p>
                    <p className="mt-1 break-all text-base font-medium text-[color:var(--text-primary)]">
                      {contactPhone}
                    </p>
                  </div>
                </a>

                <a
                  href={contactAddressQuery}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 transition hover:opacity-90"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-muted)]">
                    <MapPin className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      Office
                    </p>
                    <div className="mt-1 space-y-1 text-base font-medium leading-7 text-[color:var(--text-primary)]">
                      {addressLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[color:var(--shadow-soft)]">
              <div className="relative">
                <iframe
                  title="Veagle Space office map"
                  src={officeMapEmbedUrl}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[340px] w-full border-0"
                />
                <a
                  href={contactAddressQuery}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open Veagle Space office in Google Maps"
                  className="absolute inset-0 z-10 cursor-pointer"
                >
                  <span className="sr-only">Open office location in Google Maps</span>
                </a>
              </div>

              <div className="border-t border-[color:var(--border)] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  Office Location
                </p>
                <div className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--text-primary)]">
                  {addressLines.map((line) => (
                    <p key={`map-${line}`}>{line}</p>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-6 text-[color:var(--text-muted)]">
                  Click on the map to open this location in Google Maps.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <LeadCaptureForm
              serviceOptions={serviceOptions}
              appearance="orbital"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
              What Happens Next
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">
              A simple process from first inquiry to project discussion.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="pointer-events-none absolute left-1/4 right-1/4 top-12 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(116,130,159,0.35),transparent)] md:block" />

            {responseSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="relative z-10 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)]">
                    <Icon className={`h-8 w-8 ${step.iconColor}`} />
                  </div>
                  <h3 className="mt-6 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <SecondaryLink href="/services">
              Explore All Services
            </SecondaryLink>
          </div>
        </div>
      </section>
    </main>
  );
}
