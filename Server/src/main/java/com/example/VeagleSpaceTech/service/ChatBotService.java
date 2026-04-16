package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ChatSupportRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatSupportResponseDTO;
import com.example.VeagleSpaceTech.entity.ChatSupportTicket;
import com.example.VeagleSpaceTech.repo.ChatSupportTicketRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Locale;
import java.util.List;
import java.util.Map;

@Service
public class ChatBotService {

    private static final List<String> PLATFORM_KEYWORDS = List.of(
        "veagle", "service", "services", "project", "quote", "pricing", "cost",
        "website", "web", "ecommerce", "erp", "software", "mobile app", "android", "ios",
        "seo", "smo", "marketing", "ui", "ux", "design", "graphic",
        "bpo", "kpo", "zoho", "outsourcing", "data entry", "banking",
        "career", "job", "apply", "hiring", "hr", "portfolio", "client", "clients",
        "contact", "email", "phone", "address", "location", "pune", "support",
        "hello", "hi", "hey"
    );

    private static final String OFF_TOPIC_REPLY =
        "I'm not very familiar with topics outside Veagle Space services and support. "
            + "Please share your requirement through the contact form, and our team will get back to you within 24 hours.";

    private static final String SERVICES_ONLY_REPLY =
        "We offer software development, website and e-commerce development, ERP solutions, mobile app development, digital marketing (SEO/SMO), UI/UX and graphic design, BPO/KPO, data entry, banking software solutions, Zoho implementation, and resource outsourcing services. "
            + "If you share your requirement through the contact form, our team will get back within 24 hours.";

    @Value("${cerebras.api.key:}")
    private String cerebrasApiKey;

    @Autowired
    private ChatSupportTicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
            You are Veagle Assistant, the friendly support chatbot for Veagle Space Technology Pvt. Ltd. — a software and digital services company based in Pune, India.

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
            1. Be friendly, warm, and professional — like a helpful colleague.
            2. Keep answers to 1-3 sentences. No bullet points or headers.
            3. For service enquiries, mention they can contact via email or phone or use the Contact page.
            4. For career questions, direct them to the Career page or hr@veaglespacetech.com.
            5. For project quotes or custom requirements, say the team will get back within 24 hours after they fill the contact form.
            6. Set confidence to "high" for ANY question about Veagle's services, career, contact, location, or portfolio.
            7. Only set confidence to "low" if the question is completely unrelated to the company (cricket, weather, recipes, etc.).
            8. Never make up services or products not listed above.
            9. Never say "let me check" — just answer directly.
            10. Always be encouraging and welcoming to potential clients.

            TONE EXAMPLES:
            BAD: "Navigate to /contact and fill out form ID 4."
            GOOD: "You can reach us through the Contact page on our website or call us at +91 82379 99101!"

            BAD: "We offer services in category X."
            GOOD: "Yes, we do build mobile apps! Our team handles both Android and iOS development."

            YOU MUST RESPOND WITH ONLY A JSON OBJECT. NO OTHER TEXT BEFORE OR AFTER.
            DO NOT explain. DO NOT greet. START with { and END with }

            Respond in this exact format:
            {"answer":"your friendly answer here","confidence":"high"}
            """;

    public ChatResponseDTO chat(String message) {
        if (!isPlatformRelated(message)) {
            return new ChatResponseDTO(OFF_TOPIC_REPLY, "low", true);
        }

        if (isServiceCatalogQuestion(message)) {
            return new ChatResponseDTO(SERVICES_ONLY_REPLY, "high", false);
        }

        if (cerebrasApiKey == null || cerebrasApiKey.isBlank()) {
            return new ChatResponseDTO(
                "Hi! I'm having a little trouble connecting right now. Please reach us directly at info@veaglespace.com or call +91 82379 99101 — we'd love to help!",
                "low",
                true
            );
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

            // Strip markdown code fences if any
            String cleaned = content
                .replaceAll("(?i)```json\\s*", "")
                .replaceAll("(?i)```\\s*", "")
                .trim();

            // Extract first JSON object
            int start = cleaned.indexOf('{');
            int end = cleaned.lastIndexOf('}');
            if (start != -1 && end != -1 && end > start) {
                cleaned = cleaned.substring(start, end + 1);
            }

            JsonNode parsed = objectMapper.readTree(cleaned);
            String answer = parsed.path("answer").asText("I couldn't find a reliable answer for that.");
            String confidence = parsed.path("confidence").asText("low");
            boolean showForm = "low".equals(confidence);

            return new ChatResponseDTO(answer, confidence, showForm);

        } catch (Exception e) {
            System.err.println("[VeagleBot] AI error: " + e.getMessage());
            return new ChatResponseDTO(
                "I'm having a bit of trouble right now. Feel free to reach us at info@veaglespace.com or call +91 82379 99101!",
                "low",
                true
            );
        }
    }

    private boolean isPlatformRelated(String message) {
        if (message == null || message.isBlank()) {
            return false;
        }

        String normalized = message.toLowerCase(Locale.ROOT);
        for (String keyword : PLATFORM_KEYWORDS) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private boolean isServiceCatalogQuestion(String message) {
        if (message == null || message.isBlank()) {
            return false;
        }

        String normalized = message.toLowerCase(Locale.ROOT);
        boolean asksForServices = normalized.contains("service") || normalized.contains("services");
        boolean asksList = normalized.contains("what")
            || normalized.contains("which")
            || normalized.contains("offer")
            || normalized.contains("provide")
            || normalized.contains("list");

        return asksForServices && asksList;
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

        // Send notification to support team
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
                emailService.sendEmail(supportEmail, subject, body);
            }
        } catch (Exception e) {
            System.err.println("[VeagleBot] Support notification email failed: " + e.getMessage());
        }

        // Send confirmation to user
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
            emailService.sendEmail(ticket.getEmail(), confirmSubject, confirmBody);
        } catch (Exception e) {
            System.err.println("[VeagleBot] Confirmation email failed: " + e.getMessage());
        }

        return new ChatSupportResponseDTO(true, ticketId, "Query submitted. We will reply within 24 hours.");
    }
}
