export function buildLeadPayload(body = {}) {
  const subject = body.serviceInterest?.trim() || "General enquiry";
  const details = [
    body.company?.trim() ? `Company: ${body.company.trim()}` : null,
    body.budget?.trim() ? `Budget: ${body.budget.trim()}` : null,
    body.timeline?.trim() ? `Timeline: ${body.timeline.trim()}` : null,
    body.phone?.trim() ? `Phone: ${body.phone.trim()}` : null,
  ].filter(Boolean);

  const message = [
    body.message?.trim() || "",
    details.length ? "" : null,
    ...details,
  ]
    .filter((item) => item !== null && item !== "")
    .join("\n");

  return {
    name: body.name?.trim() || "",
    email: body.email?.trim() || "",
    contact: body.phone?.trim() || "",
    subject,
    message,
  };
}

export function mapLeadRecord(item = {}) {
  return {
    id: item.id,
    name: item.name || "",
    email: item.email || "",
    phone: item.contact || "",
    serviceInterest: item.subject || "",
    message: item.message || "",
    status: item.isRead ? "contacted" : "new",
    createdAt: item.createdAt || null,
  };
}
