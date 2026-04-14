import {
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
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_PHONE_LINK } from "@/lib/site";

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
  return address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export default function ContactPageContent({ content, services = [] }) {
  const contact = content?.contact || {};
  const contactEmail = contact.email || COMPANY_EMAIL;
  const contactPhone = contact.phone || COMPANY_PHONE;
  const contactPhoneLink = contact.phone
    ? `tel:${String(contact.phone).replace(/[^\d+]/g, "")}`
    : COMPANY_PHONE_LINK;
  const contactAddress = contact.address || COMPANY_ADDRESS;
  const contactAddressQuery = `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`;
  const serviceOptions = services.map((service) => ({
    value: service.title,
    label: service.title,
  }));
  const addressLines = toAddressLines(contactAddress);

  return (
    <main className={pageClass}>
      <section className="px-4 pb-8 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)] px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--accent-success)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                Contact Veagle Space
              </span>
            </div>
            <h1 className={`mt-7 max-w-5xl ${pageHeroTitleClass} text-white`}>
              {renderHeroTitle(contact.title)}
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)]">
              {contact.description ||
                "Tell us about your requirement and our team will help you shape the right website, software, ERP or digital growth solution."}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-5">
            <div>
              <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
                What to Share
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                To help us respond faster and more clearly, include the following details in your inquiry:
              </p>
            </div>

            <ul className="space-y-6">
              {enquiryChecklist.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.title} className="flex gap-4">
                    <div className="mt-0.5 text-[color:var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-headline text-base font-black tracking-tight text-[color:var(--text-primary)]">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--text-muted)]">
                        {item.description}
                      </p>
                    </div>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f27]">
                    <AtSign className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f27]">
                    <Phone className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f27]">
                    <MapPin className="h-4.5 w-4.5 text-[color:var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                      Office
                    </p>
                    <p className="mt-1 text-base font-medium text-[color:var(--text-primary)]">
                      {addressLines[0] || contactAddress}
                      <br />
                      {addressLines[1] || "Pune, Maharashtra"}
                    </p>
                  </div>
                </a>
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
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1rem] border border-white/8 bg-[#1b1f27]">
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
