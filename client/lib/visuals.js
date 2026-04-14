const serviceIllustrations = [
  { pattern: /(data entry|bpo|kpo)/i, src: "/Data Entry Work.png" },
  { pattern: /(bank|loan|insurance|finance|banking)/i, src: "/Banking Services.png" },
  { pattern: /(zoho|suite|crm|product)/i, src: "/Zoho Products.png" },
  { pattern: /(resource|outsour|staff)/i, src: "/Resource Outsourching.png" },
  { pattern: /(digital marketing|seo|smo|marketing|growth)/i, src: "/Digital Marketing.png" },
  { pattern: /(seo.*smo|smo.*seo)/i, src: "/SEO SMO.png" },
  { pattern: /(mobile|android|ios|app)/i, src: "/Mobile Application Development.png" },
  { pattern: /(software|erp|dashboard|platform|java|spring)/i, src: "/Software Development.png" },
  { pattern: /(e-commerce|ecommerce|commerce|shop|store)/i, src: "/E-Commerce Website Development.png" },
  { pattern: /(website|web|design.*develop)/i, src: "/Website Design & Development.png" },
  { pattern: /(graphic|design)/i, src: "/Graphic Design.png" },
  { pattern: /(ui|ux|ui.*ux)/i, src: "/UI UX Design.png" },
  { pattern: /(erp|system)/i, src: "/ERP System Development.png" },
  { pattern: /(digital.*product)/i, src: "/Digital Products.png" },
];

const productIllustrations = [
  { pattern: /(data entry|bpo|kpo)/i, src: "/Data Entry Work.png" },
  { pattern: /(bank|loan|insurance|finance|banking)/i, src: "/Banking Services.png" },
  { pattern: /(zoho|suite|crm)/i, src: "/Zoho Products.png" },
  { pattern: /(digital.*product|digital.*token)/i, src: "/Digital Products.png" },
  { pattern: /(software|erp|dashboard|platform)/i, src: "/Software Development.png" },
  { pattern: /(e-commerce|ecommerce|commerce)/i, src: "/E-Commerce Website Development.png" },
  { pattern: /(mobile|android|ios|app)/i, src: "/Mobile Application Development.png" },
  { pattern: /(website|web)/i, src: "/Website Design & Development.png" },
  { pattern: /(marketing|seo|smo|growth)/i, src: "/Digital Marketing.png" },
];

const caseIllustrations = [
  { pattern: /(erp|operations|factory|dashboard)/i, src: "/ERP System Development.png" },
  { pattern: /(mobile|field|app)/i, src: "/Mobile Application Development.png" },
  { pattern: /(growth|seo|marketing|brand)/i, src: "/Digital Marketing.png" },
  { pattern: /(bank|finance)/i, src: "/Banking Services.png" },
  { pattern: /(data|process)/i, src: "/Data Entry Work.png" },
  { pattern: /(zoho|suite|catalog|product)/i, src: "/Zoho Products.png" },
  { pattern: /(website|launch|commerce|web)/i, src: "/Website Design & Development.png" },
];

function resolveByPattern(title, items, fallback) {
  const match = items.find((item) => item.pattern.test(title || ""));
  return match?.src || fallback;
}

export const pageArtwork = {
  hero: "/veagle-hero-orbit.svg",
  about: "/veagle-about-network.svg",
  services: "/veagle-services-flow.svg",
  career: "/veagle-career-launch.svg",
};

export function resolveServiceIllustration(title, fallback = "/Website Design & Development.png") {
  return resolveByPattern(title, serviceIllustrations, fallback);
}

export function resolveProductIllustration(title, fallback = "/Digital Products.png") {
  return resolveByPattern(title, productIllustrations, fallback);
}

export function resolveCaseStudyIllustration(title, fallback = "/Website Design & Development.png") {
  return resolveByPattern(title, caseIllustrations, fallback);
}
