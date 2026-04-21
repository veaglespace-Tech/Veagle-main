package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ChatSupportRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatSupportResponseDTO;
import com.example.VeagleSpaceTech.entity.ChatSupportTicket;
import com.example.VeagleSpaceTech.repo.ChatSupportTicketRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ChatBotService {

    private static final List<String> RELATED_KEYWORDS = List.of(
        "veagle", "service", "services", "solution", "solutions", "project", "quote", "pricing", "price", "cost",
        "budget", "timeline", "proposal", "develop", "development", "website", "web", "ecommerce", "commerce",
        "shopify", "woocommerce", "erp", "crm", "software", "saas", "dashboard", "portal", "automation",
        "mobile app", "mobile apps", "app", "android", "ios", "seo", "smo", "marketing", "ads", "ui", "ux",
        "design", "graphic", "branding", "bpo", "kpo", "zoho", "outsourcing", "resource outsourcing",
        "staff augmentation", "data entry", "back office", "banking", "career", "job", "jobs", "apply",
        "application", "hiring", "vacancy", "opening", "internship", "fresher", "hr", "portfolio", "client",
        "clients", "contact", "email", "phone", "call", "whatsapp", "address", "location", "office", "pune",
        "support", "maintenance", "hello", "hi", "hey"
    );

    private static final List<String> OFF_TOPIC_KEYWORDS = List.of(
        "weather", "temperature", "rain", "forecast", "cricket", "ipl", "match", "score", "football", "soccer",
        "movie", "movies", "actor", "actress", "song", "songs", "lyrics", "music", "recipe", "cook", "cooking",
        "food", "restaurant", "politics", "election", "president", "prime minister", "stock", "share market",
        "crypto", "bitcoin", "ethereum", "horoscope", "zodiac", "astrology", "news", "joke", "meme", "poem",
        "story", "travel", "flight", "train", "hotel", "black hole", "planet", "galaxy", "science", "math",
        "history", "geography", "capital of"
    );

    private static final String OFF_TOPIC_REPLY =
        "I'm not very familiar with topics outside Veagle Space services and support.";

    private static final String SERVICES_ONLY_REPLY =
        "We offer software development, website and e-commerce development, ERP and CRM solutions, mobile app development, digital marketing, UI/UX and graphic design, BPO/KPO, data entry, banking software solutions, Zoho implementation, and resource outsourcing services.";

    private static final String CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
            You are Veagle Assistant, the friendly support chatbot for Veagle Space Technology Pvt. Ltd. - a software and digital services company based in Pune, India.

            COMPANY OVERVIEW:
            Veagle Space Tech offers: Software Development, Website Design & Development, E-Commerce Website Development, ERP System Development, Mobile Application Development, Digital Marketing, SEO & SMO, Graphic Design, UI/UX Design, BPO & KPO Services, Banking Services, Data Entry Work, Resource Outsourcing, Zoho implementation services.

            WHAT WE DO:
            - Custom software and web application development
            - Dynamic and static website design
            - E-commerce platforms (Shopify, WooCommerce, custom)
            - ERP systems for businesses
            - Android and iOS mobile apps
            - Digital marketing campaigns (SEO, SMO, Google Ads)
            - Graphic design and branding
            - UI/UX design and prototyping
            - BPO and KPO outsourcing services
            - Data entry and back-office work
            - Zoho CRM, Books, and other Zoho product implementation
            - Banking sector software solutions
            - Resource outsourcing and staff augmentation

            CONTACT & LOCATION:
            - Website: www.veaglespace.com
            - Email: info@veaglespace.com
            - Phone: +91 82379 99101
            - Address: Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune, Maharashtra 411041
            - WhatsApp: +91 82379 99101

            CAREER:
            - Veagle Space Tech hires freshers and experienced professionals
            - Job applications can be submitted via the Career page on the website
            - HR email: hr@veaglespacetech.com

            PORTFOLIO:
            - The company has worked with multiple clients across industries
            - Portfolio projects can be viewed on the Portfolio page of the website

            ANSWER RULES:
            1. Be friendly, warm, and professional - like a helpful colleague.
            2. Keep answers to 1-3 sentences. No bullet points or headers.
            3. For service enquiries, mention they can contact via email or phone or use the Contact page.
            4. For career questions, direct them to the Career page or hr@veaglespacetech.com.
            5. For project quotes or custom requirements, say the team will get back within 24 hours after they share their requirement.
            6. Set confidence to "high" for any question about Veagle's services, career, contact, location, or portfolio.
            7. Only set confidence to "low" if the question is completely unrelated to the company (cricket, weather, recipes, etc.).
            8. Never make up services or products not listed above.
            9. Never say "let me check" - just answer directly.
            10. Always be encouraging and welcoming to potential clients.

            YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO OTHER TEXT BEFORE OR AFTER.
            DO NOT explain. DO NOT greet. START with { and END with }

            Respond in this exact format:
            {"answer":"your friendly answer here","confidence":"high"}
            """;

    @Value("${cerebras.api.key:}")
    private String cerebrasApiKey;

    @Autowired
    private ChatSupportTicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    public ChatResponseDTO chat(String message, boolean loggedIn) {
        if (isClearlyOffTopic(message)) {
            return unrelatedResponse(loggedIn);
        }

        @Nullable String cannedAnswer = getRuleBasedAnswer(message);
        if (cannedAnswer != null) {
            return relatedResponse(cannedAnswer, "high");
        }

        if (cerebrasApiKey == null || cerebrasApiKey.isBlank()) {
            return relatedResponse(genericPlatformReply(), "medium");
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "model", "llama3.1-8b",
                "temperature", 0.2,
                "max_tokens", 400,
                "messages", List.of(
                    Map.of("role", "system", "content", SYSTEM_PROMPT),
                    Map.of("role", "user", "content", message)
                )
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(CEREBRAS_API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + cerebrasApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode root = objectMapper.readTree(response.body());
            String content = root
                .path("choices").get(0)
                .path("message")
                .path("content")
                .asText("{}");

            String cleaned = content
                .replaceAll("(?i)```json\\s*", "")
                .replaceAll("(?i)```\\s*", "")
                .trim();

            int start = cleaned.indexOf('{');
            int end = cleaned.lastIndexOf('}');
            if (start != -1 && end != -1 && end > start) {
                cleaned = cleaned.substring(start, end + 1);
            }

            JsonNode parsed = objectMapper.readTree(cleaned);
            String answer = parsed.path("answer").asText(genericPlatformReply());
            String confidence = parsed.path("confidence").asText("high");
            boolean unrelated = "low".equalsIgnoreCase(confidence) && !isLikelyPlatformRelated(message);

            if (unrelated) {
                return unrelatedResponse(loggedIn);
            }

            return relatedResponse(answer, confidence);
        } catch (Exception e) {
            System.err.println("[VeagleBot] AI error: " + e.getMessage());
            return relatedResponse(genericPlatformReply(), "medium");
        }
    }

    private ChatResponseDTO relatedResponse(String answer, String confidence) {
        return new ChatResponseDTO(answer, confidence, false, false);
    }

    private ChatResponseDTO unrelatedResponse(boolean loggedIn) {
        return new ChatResponseDTO(OFF_TOPIC_REPLY, "low", loggedIn, true);
    }

    private boolean isLikelyPlatformRelated(String message) {
        return containsAny(normalize(message), RELATED_KEYWORDS);
    }

    private boolean isClearlyOffTopic(String message) {
        String normalized = normalize(message);
        if (normalized.isBlank() || containsAny(normalized, RELATED_KEYWORDS)) {
            return false;
        }

        return containsAny(normalized, OFF_TOPIC_KEYWORDS);
    }

    private boolean containsAny(String message, List<String> keywords) {
        for (String keyword : keywords) {
            if (message.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String message) {
        return message == null ? "" : message.toLowerCase(Locale.ROOT).replaceAll("\\s+", " ").trim();
    }

    @Nullable
    private String getRuleBasedAnswer(String message) {
        String normalized = normalize(message);
        if (normalized.isBlank()) {
            return null;
        }

        if (containsAny(normalized, List.of("hello", "hi", "hey", "good morning", "good afternoon", "good evening"))) {
            return "Hi! I can help with Veagle's services, projects, careers, portfolio, and contact details. Ask me anything about what we offer.";
        }

        if (isServiceCatalogQuestion(normalized)) {
            return SERVICES_ONLY_REPLY;
        }

        if (containsAny(normalized, List.of("quote", "pricing", "price", "cost", "budget", "proposal"))) {
            return "Yes, we handle custom project requirements. Share your scope and timeline, and our team can review it and get back to you with the next steps within 24 hours.";
        }

        if (containsAny(normalized, List.of("mobile app", "mobile apps", "android", "ios", "app development"))) {
            return "Yes, we build mobile applications for both Android and iOS. We can help with design, development, and deployment based on your project needs.";
        }

        if (containsAny(normalized, List.of("website", "web", "ecommerce", "shopify", "woocommerce"))) {
            return "Yes, we build business websites, e-commerce platforms, and custom web applications. We can support everything from design to deployment.";
        }

        if (containsAny(normalized, List.of("erp", "crm", "dashboard", "portal", "automation", "saas"))) {
            return "Yes, we develop ERP, CRM, dashboards, portals, and other custom business software solutions. We tailor them to your workflow and business goals.";
        }

        if (containsAny(normalized, List.of("seo", "smo", "marketing", "ads", "digital marketing"))) {
            return "Yes, we also provide digital marketing support including SEO, SMO, and campaign services. Our team can help improve your online reach and lead generation.";
        }

        if (containsAny(normalized, List.of("ui", "ux", "graphic", "branding", "design"))) {
            return "Yes, we offer UI/UX, graphic design, and branding support along with development services. That includes user-friendly interfaces and visual design for digital products.";
        }

        if (containsAny(normalized, List.of("zoho"))) {
            return "Yes, we provide Zoho implementation services, including business process setup and workflow support. We can help you align Zoho tools with your operations.";
        }

        if (containsAny(normalized, List.of("bpo", "kpo", "outsourcing", "resource outsourcing", "staff augmentation", "data entry", "back office", "banking"))) {
            return "Yes, Veagle also supports BPO, KPO, data entry, banking software solutions, and resource outsourcing requirements. You can share your requirement and we will guide you on the right engagement model.";
        }

        if (containsAny(normalized, List.of("career", "job", "jobs", "apply", "application", "hiring", "vacancy", "internship", "fresher", "hr"))) {
            return "You can apply for opportunities through the Career page on our website. If you need help with openings or application details, you can also reach out at hr@veaglespacetech.com.";
        }

        if (containsAny(normalized, List.of("portfolio", "client", "clients", "work sample", "case study"))) {
            return "You can explore our work and client projects on the Portfolio page of the website. If you want something specific, tell me the type of project and I can guide you better.";
        }

        if (containsAny(normalized, List.of("contact", "email", "phone", "call", "whatsapp"))) {
            return "You can reach Veagle Space at info@veaglespace.com or call or WhatsApp +91 82379 99101. You can also use the Contact page on the website.";
        }

        if (containsAny(normalized, List.of("address", "location", "where are you", "where is your office", "office", "pune"))) {
            return "We are based in Pune, Maharashtra. Our office is at Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune 411041.";
        }

        return null;
    }

    private boolean isServiceCatalogQuestion(String normalizedMessage) {
        boolean asksForServices = normalizedMessage.contains("service") || normalizedMessage.contains("services");
        boolean asksList = normalizedMessage.contains("what")
            || normalizedMessage.contains("which")
            || normalizedMessage.contains("offer")
            || normalizedMessage.contains("provide")
            || normalizedMessage.contains("list");

        return asksForServices && asksList;
    }

    private String genericPlatformReply() {
        return "I can help with Veagle's services, careers, portfolio, project enquiries, and contact details. You can also reach us at info@veaglespace.com or call +91 82379 99101.";
    }

    public ChatSupportResponseDTO submitSupport(ChatSupportRequestDTO dto) {
        if (dto.getName() == null || dto.getName().isBlank()
            || dto.getEmail() == null || dto.getEmail().isBlank()
            || dto.getMessage() == null || dto.getMessage().isBlank()) {
            throw new IllegalArgumentException("Name, email, and message are required.");
        }

        ChatSupportTicket ticket = new ChatSupportTicket();
        ticket.setName(dto.getName().trim());
        ticket.setEmail(dto.getEmail().trim().toLowerCase());
        ticket.setSubject(dto.getSubject() != null && !dto.getSubject().isBlank()
            ? dto.getSubject().trim()
            : "Support Query");
        ticket.setMessage(dto.getMessage().trim());
        ticket.setStatus("PENDING");

        ticket = ticketRepository.save(ticket);
        Long ticketId = ticket.getId();

        try {
            String supportEmail = System.getenv("SUPPORT_EMAIL");
            if (supportEmail == null || supportEmail.isBlank()) {
                supportEmail = System.getenv("MAIL_USER");
            }
            if (supportEmail != null && !supportEmail.isBlank()) {
                String subject = "[Veagle Support] " + ticket.getSubject() + " - Ticket #" + ticketId;
                String body = "New support query received via website chatbot.\n\n"
                    + "Ticket ID: #" + ticketId + "\n"
                    + "Name: " + ticket.getName() + "\n"
                    + "Email: " + ticket.getEmail() + "\n"
                    + "Subject: " + ticket.getSubject() + "\n\n"
                    + "Message:\n" + ticket.getMessage();
                emailService.sendEmailToHrAndAdmin(supportEmail, subject, body);
            }
        } catch (Exception e) {
            System.err.println("[VeagleBot] Support notification email failed: " + e.getMessage());
        }

        try {
            String firstName = ticket.getName().split("\\s+")[0];
            String confirmSubject = "We received your query - Ticket #" + ticketId;
            String confirmBody = "Hello " + firstName + ",\n\n"
                + "Thank you for reaching out to Veagle Space Technology!\n\n"
                + "We have received your support request.\n\n"
                + "Ticket ID: #" + ticketId + "\n"
                + "Subject: " + ticket.getSubject() + "\n\n"
                + "Our team will get back to you within 24 hours.\n\n"
                + "Best regards,\n"
                + "Veagle Space Team\n"
                + "www.veaglespace.com\n"
                + "info@veaglespace.com | +91 82379 99101";
            emailService.sendSupportConfirmation(ticket.getEmail(), confirmSubject, confirmBody);
        } catch (Exception e) {
            System.err.println("[VeagleBot] Confirmation email failed: " + e.getMessage());
        }

        return new ChatSupportResponseDTO(true, ticketId, "Query submitted. We will reply within 24 hours.");
    }
}
