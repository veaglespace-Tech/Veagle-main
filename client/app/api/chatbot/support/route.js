import { proxyChatbotPost } from "@/lib/chatbot-proxy";

export async function POST(request) {
  return proxyChatbotPost(request, "/api/public/chatbot/support");
}
