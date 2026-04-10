import { readCmsContent } from "@/lib/cms/local-store";

export async function getSiteContent() {
  return readCmsContent();
}
