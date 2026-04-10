import Link from "next/link";
import {
  AtSign,
  Clock3,
  Compass,
  Eye,
  MailCheck,
  MapPin,
  Network,
  TerminalSquare,
} from "lucide-react";

import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { COMPANY_ADDRESS, COMPANY_EMAIL } from "@/lib/site";

const enquiryChecklist = [
  {
    title: "System Vulnerabilities",
    description:
      "Identify what feels weak or inefficient in your current infrastructure.",
    icon: TerminalSquare,
  },
  {
    title: "Critical Services",
    description:
      "Specify which core services and operational modules matter most.",
    icon: Network,
  },
  {
    title: "Mission Parameters",
    description:
      "Provide an estimated timeline and budgetary constraints for deployment.",
    icon: Clock3,
  },
];

const responseSteps = [
  {
    title: "Review the brief",
    description:
      "Our engineering leads perform a deep-scan of your requirements and technical scope.",
    icon: Eye,
    iconColor: "text-[#8ab0ff]",
  },
  {
    title: "Identify direction",
    description:
      "We map out the architectural trajectory and identify the optimal technology stack.",
    icon: Compass,
    iconColor: "text-[#56e240]",
  },
  {
    title: "Reply with clarity",
    description:
      "You receive a practical proposal with technical breakdown and mission timeline.",
    icon: MailCheck,
    iconColor: "text-[#8ab0ff]",
  },
];

function renderHeroTitle(value) {
  const title =
    value ||
    "Start the next version of your website, software or dashboard";

  return title.split(/(website|software|dashboard)/gi).map((part, index) => {
    const key = `${part}-${index}`;
    const lowered = part.toLowerCase();

    if (lowered === "website" || lowered === "software") {
      return (
        <span key={key} className="text-[#b3c5ff]">
          {part}
        </span>
      );
    }

    if (lowered === "dashboard") {
      return (
        <span key={key} className="text-[#56e240]">
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
  const contactAddress = contact.address || COMPANY_ADDRESS;
  const contactAddressQuery = `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`;
  const serviceOptions = services.map((service) => ({
    value: service.title,
    label: service.title,
  }));
  const addressLines = toAddressLines(contactAddress);

  return (
    <main className="overflow-hidden bg-[#131314] text-[#e4e2e2]">
      <section className="px-4 pb-8 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2e4f8d]/45 bg-[#1b2440]/45 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#56e240]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b7cbff]">
                Transmission Protocol Active
              </span>
            </div>
            <h1 className="mt-7 max-w-5xl font-headline text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {renderHeroTitle(contact.title)}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#b7c3db]">
              {contact.description ||
                "Initiate your project with our engineering team. We convert complex technical requirements into high-performance digital infrastructure."}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-5">
            <div>
              <h2 className="font-headline text-3xl font-black tracking-tight text-white">
                Better Input, Better Reply
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#aebad2]">
                Precision is our priority. To ensure a successful project launch, consider these key data points:
              </p>
            </div>

            <ul className="space-y-6">
              {enquiryChecklist.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.title} className="flex gap-4">
                    <div className="mt-0.5 text-[#7ea7ff]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-[#aebad2]">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(40,43,50,0.45)] p-6 backdrop-blur-md">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                Reach us directly
              </h3>
              <div className="mt-6 space-y-5">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-start gap-4 transition hover:opacity-90"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2533]">
                    <AtSign className="h-4.5 w-4.5 text-[#7ea7ff]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#95a3bd]">
                      Email us
                    </p>
                    <p className="mt-1 break-all text-base font-medium text-white">
                      {contactEmail}
                    </p>
                  </div>
                </a>

                <a
                  href={contactAddressQuery}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 transition hover:opacity-90"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2533]">
                    <MapPin className="h-4.5 w-4.5 text-[#7ea7ff]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#95a3bd]">
                      Visit location
                    </p>
                    <p className="mt-1 text-base font-medium text-white">
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
            <h2 className="font-headline text-3xl font-black tracking-tight text-white sm:text-4xl">
              The Response Protocol
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#adb9d1] sm:text-base">
              How our team processes your transmission from arrival to execution.
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
                  <h3 className="mt-6 font-headline text-2xl font-black tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#aebad2]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-[#1c212b] px-7 py-3 text-sm font-bold text-[#d5dff4] transition hover:bg-[#252c39]"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

