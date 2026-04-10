import { requirePortalRole } from "@/lib/portal/token";
import { readCmsContent, writeCmsContent } from "@/lib/cms/local-store";

export async function GET(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const content = await readCmsContent();
  return Response.json(content);
}

export async function PUT(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const body = await request.json();
  const content = await writeCmsContent(body);
  return Response.json(content);
}
