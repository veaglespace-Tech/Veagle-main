const serviceIllustrations = [
  { pattern: /(data entry|bpo|kpo)/i, src: "/veagle-art-data.svg" },
  { pattern: /(bank|loan|insurance|finance)/i, src: "/veagle-art-finance.svg" },
  { pattern: /(zoho|suite|crm|product)/i, src: "/veagle-art-suite.svg" },
  { pattern: /(resource|outsour|staff)/i, src: "/veagle-art-suite.svg" },
  { pattern: /(digital marketing|seo|smo|marketing|growth)/i, src: "/veagle-art-growth.svg" },
  { pattern: /(mobile|android|ios|app)/i, src: "/veagle-art-mobile.svg" },
  { pattern: /(software|erp|dashboard|platform|java|spring)/i, src: "/veagle-art-platform.svg" },
  { pattern: /(website|web|e-commerce|ui|ux|graphic|design)/i, src: "/veagle-art-web.svg" },
];

const caseIllustrations = [
  { pattern: /(erp|operations|factory|dashboard)/i, src: "/veagle-art-platform.svg" },
  { pattern: /(mobile|field|app)/i, src: "/veagle-art-mobile.svg" },
  { pattern: /(growth|seo|marketing|brand)/i, src: "/veagle-art-growth.svg" },
  { pattern: /(bank|finance)/i, src: "/veagle-art-finance.svg" },
  { pattern: /(data|process)/i, src: "/veagle-art-data.svg" },
  { pattern: /(zoho|suite|catalog|product)/i, src: "/veagle-art-suite.svg" },
  { pattern: /(website|launch|commerce|web)/i, src: "/veagle-art-web.svg" },
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
  university: "/veagle-university-lab.svg",
};

export function resolveServiceIllustration(title, fallback = "/veagle-art-web.svg") {
  return resolveByPattern(title, serviceIllustrations, fallback);
}

export function resolveProductIllustration(title, fallback = "/veagle-art-suite.svg") {
  return resolveByPattern(title, serviceIllustrations, fallback);
}

export function resolveCaseStudyIllustration(title, fallback = "/veagle-art-web.svg") {
  return resolveByPattern(title, caseIllustrations, fallback);
}
