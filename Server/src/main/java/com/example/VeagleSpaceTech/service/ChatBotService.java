package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ChatSupportRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatSupportResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.FeatureResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ProductResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class ChatBotService {

    private static final Map<String, String> STRICT_QUERY_RESPONSES = createStrictQueryResponses();

    private static final List<String> PLATFORM_KEYWORDS = List.of(
        "veagle", "veagle space", "service", "services", "solution", "solutions",
        "quote", "pricing", "price", "cost", "budget", "requirement",
        "website", "web app", "e commerce", "ecommerce", "shopify", "woocommerce",
        "erp", "crm", "software", "mobile", "mobile app", "android", "ios",
        "seo", "smo", "marketing", "branding", "ui", "ux", "design", "graphic",
        "bpo", "kpo", "zoho", "outsourcing", "resource outsourcing", "staff augmentation",
        "data entry", "banking", "automation", "dashboard",
        "career", "job", "jobs", "apply", "hiring", "interview", "hr",
        "portfolio", "case study", "product", "products", "contact", "email", "phone",
        "address", "location", "office", "pune", "whatsapp"
    );

    private static final List<String> PLATFORM_PATTERNS = List.of(
        "what do you do", "what can you do", "who are you",
        "tell me about your company", "tell me about veagle",
        "about your company", "about veagle", "about veagle space",
        "what do you offer", "what services do you offer", "what products do you have",
        "can you build", "do you build", "do you develop",
        "how can i contact", "where are you located", "how do i apply", "how can i apply",
        "show your portfolio", "show your work", "share your portfolio"
    );

    private static final Set<String> STOP_WORDS = Set.of(
        "a", "an", "and", "any", "are", "at", "be", "by", "can", "could", "do", "does", "for",
        "from", "get", "have", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "our",
        "please", "show", "tell", "that", "the", "their", "them", "they", "to", "us", "we", "what",
        "which", "who", "why", "with", "you", "your"
    );

    private static final List<FaqEntry> DEFAULT_FAQ_KNOWLEDGE = List.of(
        new FaqEntry(
            "What services does Veagle Space provide?",
            "Veagle Space provides website design and development, e-commerce websites, mobile app development, software development, ERP systems, digital marketing, UI/UX design, graphic design, SEO / SMO, data entry work, BPO / KPO services and resource outsourcing support."
        ),
        new FaqEntry(
            "Do you build dynamic websites with admin control?",
            "Yes. We build dynamic websites with CMS or dashboard control so your team can manage content, products, services, jobs, clients and leads more easily."
        ),
        new FaqEntry(
            "Can you improve SEO while redesigning a website?",
            "Yes. We improve page structure, headings, metadata, internal linking, crawlability, schema support and keyword-focused content while redesigning the website."
        ),
        new FaqEntry(
            "Do you work with businesses outside Pune?",
            "Yes. Veagle Space is based in Pune, Maharashtra, and supports clients across India through remote collaboration and digital delivery workflows."
        ),
        new FaqEntry(
            "Can you help with both software development and digital marketing?",
            "Yes. Our work can include software systems, website builds, SEO, social media optimization and other growth-focused digital support based on your business needs."
        )
    );

    private static final String OFF_TOPIC_REPLY =
        "I'm not familiar with that topic. I can help with Veagle Space services, careers, support, products, portfolio, and contact details.";

    private static final String GREETING_REPLY =
        "Hi! I can help with Veagle Space services, products, project enquiries, careers, portfolio, and contact details. Ask me anything about what we do.";

    private static final String SERVICES_ONLY_REPLY =
        "We offer software development, website and e-commerce development, ERP solutions, mobile app development, digital marketing, UI/UX and graphic design, BPO/KPO, data entry, banking software solutions, Zoho implementation, and resource outsourcing services.";

    private static final String PRODUCTS_ONLY_REPLY =
        "We showcase business-focused digital solutions across software, ERP, banking, operations, and related categories based on client requirements.";

    private static final String LOCATION_REPLY =
        "Veagle Space is located at Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune, Maharashtra 411041.";

    private static final String CONTACT_REPLY =
        "You can reach Veagle Space through the Contact page, email info@veaglespace.com, or call +91 82379 99101.";

    private static final String CAREER_REPLY =
        "Veagle Space hires both freshers and experienced candidates. You can apply from the Career page on our website or reach HR at hr@veaglespacetech.com.";

    private static final String QUOTE_REPLY =
        "Yes, we handle custom project requirements for websites, software, apps, ERP, marketing, and more. Share your requirement through the Contact page, email info@veaglespace.com, or call +91 82379 99101 and our team will get back within 24 hours.";

    private static final String PORTFOLIO_REPLY =
        "You can explore Veagle Space work and client projects on the Portfolio page of the website. If you want something similar, share your requirement and our team can guide you.";

    private static final String WEBSITE_REPLY =
        "Yes, Veagle Space builds dynamic websites, e-commerce stores, and custom web applications. Share your requirement through the Contact page, email info@veaglespace.com, or call +91 82379 99101.";

    private static final String MOBILE_REPLY =
        "Yes, Veagle Space develops mobile applications for Android and iOS along with the required backend systems when needed. Share your app idea through the Contact page, email info@veaglespace.com, or call +91 82379 99101.";

    private static final String ERP_REPLY =
        "Yes, Veagle Space works on ERP systems, CRM-style solutions, Zoho implementations, automation flows, and custom business software. Share your requirement through the Contact page, email info@veaglespace.com, or call +91 82379 99101.";

    private static final String DIGITAL_REPLY =
        "Yes, we also support digital marketing, SEO, SMO, UI/UX, graphic design, and branding work. You can discuss your goals through the Contact page, email info@veaglespace.com, or call +91 82379 99101.";

    private static final String GENERAL_PLATFORM_REPLY =
        "Veagle Space is a Pune-based technology company delivering software development, websites, e-commerce, ERP systems, mobile apps, digital marketing, design, Zoho implementation, BPO/KPO, data entry, banking solutions, and resource outsourcing support.";

    private static final String DEFAULT_ABOUT_REPLY =
        "Veagle Space Technology Pvt. Ltd. is a Pune-based technology company delivering software development, dynamic websites, ERP systems, UI/UX, SEO, digital marketing and business support services for growing brands.";

    private static final String DEFAULT_ABOUT_STORY =
        "We help organizations turn business requirements into practical digital systems that are easier to use and manage.";

    private static final String DEFAULT_CAREER_OVERVIEW =
        "Veagle Space offers opportunities in development, design, marketing, and business support for freshers and experienced professionals.";

    private static final String DEFAULT_CONTACT_OVERVIEW =
        "Tell us what you want to build or improve. We handle dynamic websites, software solutions, ERP systems, e-commerce platforms, SEO support and business operations services.";

    private static final String CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
            You are Veagle Assistant, the friendly support chatbot for Veagle Space Technology Pvt. Ltd.

            Use only the verified company context supplied to you. Do not invent services, products, projects, contact details, pricing, or hiring information.

            ANSWER RULES:
            1. Be friendly, warm, and professional.
            2. Keep answers to 1-3 short sentences. No bullet points or headers.
            3. For service or product enquiries, mention the Contact page, email, or phone when useful.
            4. For career questions, direct people to the Career page or hr@veaglespacetech.com.
            5. If the question is unrelated to Veagle Space, answer with low confidence.
            6. Respond with only a JSON object and nothing else.

            Respond exactly like:
            {"answer":"your answer here","confidence":"high"}
            """;

    @Value("${cerebras.api.key:}")
    private String cerebrasApiKey;

    @Autowired
    private ChatSupportTicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Autowired(required = false)
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired(required = false)
    private SiteContentService siteContentService;

    @Autowired(required = false)
    private ORG_ServicesService orgServicesService;

    @Autowired(required = false)
    private ProductsService productsService;

    @Autowired(required = false)
    private PortfolioService portfolioService;

    public ChatResponseDTO chat(String message, boolean loggedIn) {
        String normalizedMessage = normalizeMessage(message);
        KnowledgeSnapshot knowledge = buildKnowledgeSnapshot();

        String priorityAnswer = answerFromPriorityRules(normalizedMessage, knowledge);
        if (priorityAnswer != null) {
            return buildPlatformResponse(priorityAnswer);
        }

        KnowledgeMatch bestMatch = findBestKnowledgeMatch(normalizedMessage, knowledge.entries());
        if (bestMatch != null) {
            return buildPlatformResponse(bestMatch.entry().answer());
        }

        String secondaryAnswer = answerFromSecondaryRules(normalizedMessage, knowledge);
        if (secondaryAnswer != null) {
            return buildPlatformResponse(secondaryAnswer);
        }

        if (!isPlatformRelated(normalizedMessage)) {
            return buildOffTopicResponse(loggedIn);
        }

        String fallbackReply = buildFallbackPlatformReply(normalizedMessage, knowledge);
        if (cerebrasApiKey == null || cerebrasApiKey.isBlank()) {
            return buildPlatformResponse(fallbackReply);
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "model", "llama3.1-8b",
                "temperature", 0.2,
                "max_tokens", 400,
                "messages", List.of(
                    Map.of("role", "system", "content", SYSTEM_PROMPT),
                    Map.of("role", "system", "content", buildKnowledgeContext(normalizedMessage, knowledge)),
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
                .path("choices").path(0)
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
            String answer = parsed.path("answer").asText("").trim();
            String confidence = parsed.path("confidence").asText("high");

            if (answer.isBlank()) {
                return buildPlatformResponse(fallbackReply);
            }

            return new ChatResponseDTO(
                answer,
                "low".equalsIgnoreCase(confidence) ? "high" : confidence,
                false
            );
        } catch (Exception e) {
            System.err.println("[VeagleBot] AI error: " + e.getMessage());
            return buildPlatformResponse(fallbackReply);
        }
    }

    private ChatResponseDTO buildPlatformResponse(String answer) {
        return new ChatResponseDTO(answer, "high", false);
    }

    private ChatResponseDTO buildOffTopicResponse(boolean loggedIn) {
        return new ChatResponseDTO(OFF_TOPIC_REPLY, "low", loggedIn);
    }

    private KnowledgeSnapshot buildKnowledgeSnapshot() {
        Map<String, Object> siteContent = getSiteContentSnapshot();
        List<ServicesResponseDTO> services = getServicesSnapshot();
        List<ProductResponseDTO> products = getProductsSnapshot().stream()
            .filter(product -> !Boolean.FALSE.equals(product.isActive()))
            .toList();
        List<PortfolioResponseDTO> portfolio = getPortfolioSnapshot();

        List<KnowledgeEntry> entries = new ArrayList<>();
        addDefaultKnowledge(entries);
        addSiteContentKnowledge(entries, siteContent);
        addServiceKnowledge(entries, services);
        addProductKnowledge(entries, products);
        addPortfolioKnowledge(entries, portfolio);

        return new KnowledgeSnapshot(
            deduplicateKnowledge(entries),
            buildServicesCatalogReply(services),
            buildProductsCatalogReply(products),
            buildPortfolioCatalogReply(portfolio),
            buildCompanyOverviewReply(siteContent, services, products)
        );
    }

    protected Map<String, Object> getSiteContentSnapshot() {
        try {
            return siteContentService != null ? siteContentService.getContent() : Map.of();
        } catch (Exception exception) {
            return Map.of();
        }
    }

    protected List<ServicesResponseDTO> getServicesSnapshot() {
        try {
            return orgServicesService != null ? orgServicesService.getAllServices(null) : List.of();
        } catch (Exception exception) {
            return List.of();
        }
    }

    protected List<ProductResponseDTO> getProductsSnapshot() {
        try {
            return productsService != null ? productsService.getAllProducts() : List.of();
        } catch (Exception exception) {
            return List.of();
        }
    }

    protected List<PortfolioResponseDTO> getPortfolioSnapshot() {
        try {
            return portfolioService != null ? portfolioService.getAllPortfolios() : List.of();
        } catch (Exception exception) {
            return List.of();
        }
    }

    private void addDefaultKnowledge(List<KnowledgeEntry> entries) {
        for (FaqEntry faq : DEFAULT_FAQ_KNOWLEDGE) {
            entries.add(createKnowledgeEntry("faq", faq.question(), faq.answer(), faq.question() + " " + faq.answer(), 95));
        }

        entries.add(createKnowledgeEntry(
            "about",
            "About Veagle Space",
            safeJoinSentences(DEFAULT_ABOUT_REPLY, DEFAULT_ABOUT_STORY),
            DEFAULT_ABOUT_REPLY + " " + DEFAULT_ABOUT_STORY,
            70
        ));
        entries.add(createKnowledgeEntry(
            "career",
            "Careers at Veagle Space",
            safeJoinSentences(DEFAULT_CAREER_OVERVIEW, CAREER_REPLY),
            DEFAULT_CAREER_OVERVIEW + " " + CAREER_REPLY,
            85
        ));
        entries.add(createKnowledgeEntry(
            "contact",
            "Contact Veagle Space",
            safeJoinSentences(DEFAULT_CONTACT_OVERVIEW, CONTACT_REPLY, LOCATION_REPLY),
            DEFAULT_CONTACT_OVERVIEW + " " + CONTACT_REPLY + " " + LOCATION_REPLY,
            90
        ));
    }

    private void addSiteContentKnowledge(List<KnowledgeEntry> entries, Map<String, Object> siteContent) {
        for (Map<String, Object> faq : asMapList(siteContent.get("faq"))) {
            String question = getString(faq, "question");
            String answer = getString(faq, "answer");
            if (!question.isBlank() && !answer.isBlank()) {
                entries.add(createKnowledgeEntry("faq", question, answer, question + " " + answer, 100));
            }
        }

        Map<String, Object> about = asMap(siteContent.get("about"));
        String aboutTitle = firstNonBlank(getString(about, "title"), "About Veagle Space");
        String aboutAnswer = safeJoinSentences(
            summarizeText(getString(about, "description"), 190),
            summarizeText(getString(about, "story"), 170),
            summarizeText(getString(about, "background"), 170)
        );
        if (!aboutAnswer.isBlank()) {
            entries.add(createKnowledgeEntry(
                "about",
                aboutTitle,
                aboutAnswer,
                aboutTitle + " " + aboutAnswer,
                75
            ));
        }

        Map<String, Object> career = asMap(siteContent.get("career"));
        String careerAnswer = safeJoinSentences(
            summarizeText(getString(career, "description"), 170),
            summarizeText(getString(career, "applyDescription"), 170),
            CAREER_REPLY
        );
        if (!careerAnswer.isBlank()) {
            entries.add(createKnowledgeEntry(
                "career",
                firstNonBlank(getString(career, "title"), "Careers at Veagle Space"),
                careerAnswer,
                careerAnswer,
                90
            ));
        }

        Map<String, Object> contact = asMap(siteContent.get("contact"));
        String contactAnswer = safeJoinSentences(
            summarizeText(getString(contact, "description"), 180),
            CONTACT_REPLY,
            LOCATION_REPLY
        );
        if (!contactAnswer.isBlank()) {
            entries.add(createKnowledgeEntry(
                "contact",
                firstNonBlank(getString(contact, "title"), "Contact Veagle Space"),
                contactAnswer,
                contactAnswer,
                95
            ));
        }
    }

    private void addServiceKnowledge(List<KnowledgeEntry> entries, List<ServicesResponseDTO> services) {
        for (ServicesResponseDTO service : services) {
            String title = firstNonBlank(service.title(), "Service");
            String searchText = String.join(" ",
                title,
                safeValue(service.description()),
                safeValue(service.detailTitle()),
                safeValue(service.detailDescription()),
                safeValue(service.pageContent()),
                String.join(" ", service.features() == null ? List.of() : service.features().stream()
                    .map(FeatureResponseDTO::name)
                    .filter(value -> value != null && !value.isBlank())
                    .toList())
            );

            entries.add(createKnowledgeEntry(
                "service",
                title,
                buildServiceReply(service),
                searchText,
                88
            ));
        }
    }

    private void addProductKnowledge(List<KnowledgeEntry> entries, List<ProductResponseDTO> products) {
        for (ProductResponseDTO product : products) {
            String title = firstNonBlank(product.title(), "Product");
            String searchText = String.join(" ",
                title,
                safeValue(product.description()),
                safeValue(product.categoryName())
            );

            entries.add(createKnowledgeEntry(
                "product",
                title,
                buildProductReply(product),
                searchText,
                82
            ));
        }
    }

    private void addPortfolioKnowledge(List<KnowledgeEntry> entries, List<PortfolioResponseDTO> portfolio) {
        for (PortfolioResponseDTO project : portfolio) {
            String title = firstNonBlank(project.title(), "Portfolio Project");
            String searchText = String.join(" ",
                title,
                safeValue(project.description()),
                safeValue(project.projectUrl()),
                safeValue(project.githubUrl())
            );

            entries.add(createKnowledgeEntry(
                "portfolio",
                title,
                buildPortfolioReply(project),
                searchText,
                78
            ));
        }
    }

    private List<KnowledgeEntry> deduplicateKnowledge(List<KnowledgeEntry> entries) {
        Map<String, KnowledgeEntry> unique = new LinkedHashMap<>();
        for (KnowledgeEntry entry : entries) {
            String key = normalizeMessage(entry.title() + " " + entry.answer());
            unique.putIfAbsent(key, entry);
        }
        return new ArrayList<>(unique.values());
    }

    private String buildServicesCatalogReply(List<ServicesResponseDTO> services) {
        List<String> titles = limitDistinctNonBlank(services.stream().map(ServicesResponseDTO::title).toList(), 6);
        if (titles.isEmpty()) {
            return safeJoinSentences(SERVICES_ONLY_REPLY, CONTACT_REPLY);
        }

        return safeJoinSentences(
            "Our current services include " + joinNaturalLanguageList(titles) + ".",
            CONTACT_REPLY
        );
    }

    private String buildProductsCatalogReply(List<ProductResponseDTO> products) {
        List<String> titles = limitDistinctNonBlank(products.stream().map(ProductResponseDTO::title).toList(), 5);
        List<String> categories = limitDistinctNonBlank(products.stream().map(ProductResponseDTO::categoryName).toList(), 4);

        if (titles.isEmpty()) {
            return safeJoinSentences(PRODUCTS_ONLY_REPLY, CONTACT_REPLY);
        }

        String categorySentence = categories.isEmpty()
            ? ""
            : "These solutions span categories like " + joinNaturalLanguageList(categories) + ".";

        return safeJoinSentences(
            "We currently showcase solutions like " + joinNaturalLanguageList(titles) + ".",
            categorySentence,
            CONTACT_REPLY
        );
    }

    private String buildPortfolioCatalogReply(List<PortfolioResponseDTO> portfolio) {
        List<String> titles = limitDistinctNonBlank(portfolio.stream().map(PortfolioResponseDTO::title).toList(), 4);
        if (titles.isEmpty()) {
            return PORTFOLIO_REPLY;
        }

        return safeJoinSentences(
            "You can explore portfolio work such as " + joinNaturalLanguageList(titles) + " on our Portfolio page.",
            "If you want something similar, share your requirement through the Contact page, email info@veaglespace.com, or call +91 82379 99101."
        );
    }

    private String buildCompanyOverviewReply(
        Map<String, Object> siteContent,
        List<ServicesResponseDTO> services,
        List<ProductResponseDTO> products
    ) {
        Map<String, Object> about = asMap(siteContent.get("about"));
        String aboutDescription = firstNonBlank(
            summarizeText(getString(about, "description"), 190),
            DEFAULT_ABOUT_REPLY
        );
        String aboutStory = summarizeText(getString(about, "story"), 170);

        List<String> titles = !services.isEmpty()
            ? limitDistinctNonBlank(services.stream().map(ServicesResponseDTO::title).toList(), 4)
            : limitDistinctNonBlank(products.stream().map(ProductResponseDTO::title).toList(), 3);

        String catalogSentence = titles.isEmpty()
            ? GENERAL_PLATFORM_REPLY
            : "Our core offerings include " + joinNaturalLanguageList(titles) + ".";

        return safeJoinSentences(aboutDescription, aboutStory, catalogSentence);
    }

    private String buildServiceReply(ServicesResponseDTO service) {
        String title = firstNonBlank(service.title(), "this service");
        String detail = firstNonBlank(service.description(), service.detailDescription(), service.pageContent(), "");
        String featureLine = summarizeFeatures(service.features());

        return safeJoinSentences(
            "Yes, we offer " + title + ".",
            summarizeText(firstNonBlank(detail, featureLine), 190),
            CONTACT_REPLY
        );
    }

    private String buildProductReply(ProductResponseDTO product) {
        String title = firstNonBlank(product.title(), "this solution");
        String category = safeValue(product.categoryName());
        String intro = category.isBlank()
            ? "Yes, " + title + " is one of our solutions."
            : "Yes, " + title + " is one of our " + category + " solutions.";

        return safeJoinSentences(
            intro,
            summarizeText(product.description(), 180),
            CONTACT_REPLY
        );
    }

    private String buildPortfolioReply(PortfolioResponseDTO project) {
        String title = firstNonBlank(project.title(), "this project");

        return safeJoinSentences(
            "Yes, " + title + " is one of our portfolio projects.",
            summarizeText(project.description(), 180),
            "You can explore more client work on our Portfolio page."
        );
    }

    private String summarizeFeatures(List<FeatureResponseDTO> features) {
        if (features == null || features.isEmpty()) {
            return "";
        }

        List<String> names = limitDistinctNonBlank(features.stream().map(FeatureResponseDTO::name).toList(), 4);
        if (names.isEmpty()) {
            return "";
        }

        return "Key areas include " + joinNaturalLanguageList(names) + ".";
    }

    private String answerFromPriorityRules(String normalizedMessage, KnowledgeSnapshot knowledge) {
        String strictAnswer = STRICT_QUERY_RESPONSES.get(normalizedMessage);
        if (strictAnswer != null) {
            return strictAnswer;
        }

        if (isGreetingOnly(normalizedMessage)) {
            return GREETING_REPLY;
        }

        if (isServiceCatalogQuestion(normalizedMessage)) {
            return knowledge.servicesCatalogReply();
        }

        if (isProductCatalogQuestion(normalizedMessage)) {
            return knowledge.productsCatalogReply();
        }

        if (containsAnyPhrase(normalizedMessage, List.of("quote", "pricing", "price", "cost", "budget", "estimate"))) {
            return QUOTE_REPLY;
        }

        if (containsAnyPhrase(normalizedMessage, List.of("career", "job", "jobs", "apply", "hiring", "interview", "hr"))) {
            return CAREER_REPLY;
        }

        if (containsAnyPhrase(
            normalizedMessage,
            List.of(
                "where are you located", "where are you based", "where is your office",
                "where is your company", "office address", "company address",
                "your address", "located", "location", "address"
            )
        )) {
            return LOCATION_REPLY;
        }

        if (containsAnyPhrase(
            normalizedMessage,
            List.of("contact", "email", "phone", "call", "whatsapp", "reach you", "get in touch")
        )) {
            return CONTACT_REPLY;
        }

        return null;
    }

    private String answerFromSecondaryRules(String normalizedMessage, KnowledgeSnapshot knowledge) {
        if (containsAnyPhrase(normalizedMessage, List.of("portfolio", "case study", "case studies", "recent work"))) {
            return knowledge.portfolioReply();
        }

        if (containsAnyPhrase(normalizedMessage, List.of("website", "web app", "e commerce", "ecommerce", "shopify", "woocommerce"))) {
            return WEBSITE_REPLY;
        }

        if (containsAnyPhrase(normalizedMessage, List.of("mobile", "mobile app", "android", "ios"))) {
            return MOBILE_REPLY;
        }

        if (containsAnyPhrase(normalizedMessage, List.of("erp", "crm", "zoho", "automation", "dashboard", "banking"))) {
            return ERP_REPLY;
        }

        if (containsAnyPhrase(normalizedMessage, List.of("seo", "smo", "marketing", "branding", "ui", "ux", "design", "graphic"))) {
            return DIGITAL_REPLY;
        }

        if (containsAnyPhrase(
            normalizedMessage,
            List.of(
                "what do you do", "what can you do", "who are you",
                "tell me about your company", "tell me about veagle",
                "about your company", "about veagle", "about veagle space"
            )
        )) {
            return knowledge.companyOverviewReply();
        }

        return null;
    }

    private String buildFallbackPlatformReply(String normalizedMessage, KnowledgeSnapshot knowledge) {
        if (containsAnyPhrase(normalizedMessage, List.of("product", "products", "solution", "solutions"))) {
            return knowledge.productsCatalogReply();
        }

        if (containsAnyPhrase(normalizedMessage, List.of("portfolio", "case study", "projects"))) {
            return knowledge.portfolioReply();
        }

        if (containsAnyPhrase(normalizedMessage, List.of("service", "services", "website", "software", "erp", "mobile", "seo"))) {
            return knowledge.servicesCatalogReply();
        }

        return knowledge.companyOverviewReply();
    }

    private String buildKnowledgeContext(String normalizedMessage, KnowledgeSnapshot knowledge) {
        List<KnowledgeMatch> matches = findTopKnowledgeMatches(normalizedMessage, knowledge.entries(), 5);
        StringBuilder builder = new StringBuilder();
        builder.append("Verified company context:\n");
        builder.append("- ").append(knowledge.companyOverviewReply()).append('\n');
        builder.append("- ").append(knowledge.servicesCatalogReply()).append('\n');
        builder.append("- ").append(knowledge.productsCatalogReply()).append('\n');
        builder.append("- ").append(knowledge.portfolioReply()).append('\n');
        builder.append("- ").append(CONTACT_REPLY).append('\n');
        builder.append("- ").append(LOCATION_REPLY).append('\n');
        builder.append("- ").append(CAREER_REPLY).append('\n');

        if (!matches.isEmpty()) {
            builder.append("Most relevant matched entries:\n");
            for (KnowledgeMatch match : matches) {
                builder.append("- ").append(match.entry().title()).append(": ").append(match.entry().answer()).append('\n');
            }
        }

        return truncateAtWordBoundary(builder.toString(), 3200);
    }

    private KnowledgeMatch findBestKnowledgeMatch(String normalizedMessage, List<KnowledgeEntry> entries) {
        List<KnowledgeMatch> matches = findTopKnowledgeMatches(normalizedMessage, entries, 1);
        return matches.isEmpty() ? null : matches.getFirst();
    }

    private List<KnowledgeMatch> findTopKnowledgeMatches(String normalizedMessage, List<KnowledgeEntry> entries, int limit) {
        if (normalizedMessage == null || normalizedMessage.isBlank()) {
            return List.of();
        }

        Set<String> messageTokens = tokenize(normalizedMessage);

        return entries.stream()
            .map(entry -> new KnowledgeMatch(entry, scoreKnowledgeEntry(normalizedMessage, messageTokens, entry)))
            .filter(match -> match.score() >= 24)
            .sorted(
                Comparator.comparingInt(KnowledgeMatch::score)
                    .reversed()
                    .thenComparing(match -> match.entry().title())
            )
            .limit(limit)
            .toList();
    }

    private int scoreKnowledgeEntry(String normalizedMessage, Set<String> messageTokens, KnowledgeEntry entry) {
        String normalizedTitle = normalizeMessage(entry.title());
        String searchText = entry.normalizedSearchText();

        if (!normalizedTitle.isBlank() && normalizedMessage.equals(normalizedTitle)) {
            return 260 + entry.priority();
        }

        int score = 0;

        if (!normalizedTitle.isBlank() && containsPhrase(normalizedMessage, normalizedTitle)) {
            score += 160;
        }

        if (normalizedMessage.split("\\s+").length >= 3 && containsPhrase(searchText, normalizedMessage)) {
            score += 120;
        }

        Set<String> entryTokens = tokenize(searchText);
        int tokenMatches = countTokenMatches(messageTokens, entryTokens);
        if (tokenMatches >= 2) {
            score += tokenMatches * 14;
            score += entry.priority() / 10;
        }

        if (hasSharedBigram(normalizedMessage, searchText)) {
            score += 24;
        }

        return score;
    }

    private boolean hasSharedBigram(String source, String target) {
        String[] words = source.split("\\s+");
        if (words.length < 2) {
            return false;
        }

        for (int index = 0; index < words.length - 1; index++) {
            String left = words[index];
            String right = words[index + 1];
            if (STOP_WORDS.contains(left) || STOP_WORDS.contains(right)) {
                continue;
            }
            if (containsPhrase(target, left + " " + right)) {
                return true;
            }
        }

        return false;
    }

    private int countTokenMatches(Set<String> left, Set<String> right) {
        int matches = 0;
        for (String token : left) {
            if (right.contains(token)) {
                matches++;
            }
        }
        return matches;
    }

    private boolean isPlatformRelated(String normalizedMessage) {
        if (normalizedMessage == null || normalizedMessage.isBlank()) {
            return false;
        }

        if (isGreetingOnly(normalizedMessage) || containsAnyPhrase(normalizedMessage, PLATFORM_PATTERNS)) {
            return true;
        }

        return countPhraseHits(normalizedMessage, PLATFORM_KEYWORDS) >= 2;
    }

    private int countPhraseHits(String normalizedMessage, List<String> phrases) {
        int hits = 0;
        for (String phrase : phrases) {
            if (containsPhrase(normalizedMessage, phrase)) {
                hits++;
            }
        }
        return hits;
    }

    private boolean isServiceCatalogQuestion(String normalizedMessage) {
        if (normalizedMessage == null || normalizedMessage.isBlank()) {
            return false;
        }

        boolean asksForServices = containsAnyPhrase(normalizedMessage, List.of("service", "services"));
        boolean asksList = containsAnyPhrase(
            normalizedMessage,
            List.of("what", "which", "offer", "offers", "provide", "provides", "list", "show", "have")
        );

        return asksForServices && asksList;
    }

    private boolean isProductCatalogQuestion(String normalizedMessage) {
        if (normalizedMessage == null || normalizedMessage.isBlank()) {
            return false;
        }

        boolean asksForProducts = containsAnyPhrase(normalizedMessage, List.of("product", "products", "solution", "solutions", "catalog"));
        boolean asksList = containsAnyPhrase(
            normalizedMessage,
            List.of("what", "which", "offer", "offers", "provide", "provides", "list", "show", "have")
        );

        return asksForProducts && asksList;
    }

    private boolean isGreetingOnly(String normalizedMessage) {
        return containsAnyPhrase(
            normalizedMessage,
            List.of("hi", "hello", "hey", "good morning", "good afternoon", "good evening")
        ) && normalizedMessage.split("\\s+").length <= 4;
    }

    private boolean containsAnyPhrase(String normalizedMessage, List<String> phrases) {
        for (String phrase : phrases) {
            if (containsPhrase(normalizedMessage, phrase)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsPhrase(String normalizedMessage, String phrase) {
        return (" " + normalizedMessage + " ").contains(" " + phrase + " ");
    }

    private String normalizeMessage(String message) {
        if (message == null) {
            return "";
        }

        return message
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", " ")
            .trim();
    }

    private Set<String> tokenize(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }

        LinkedHashSet<String> tokens = new LinkedHashSet<>();
        for (String token : normalizeMessage(value).split("\\s+")) {
            if (token.length() <= 1 || STOP_WORDS.contains(token)) {
                continue;
            }
            tokens.add(token);
        }
        return tokens;
    }

    private List<Map<String, Object>> asMapList(Object value) {
        if (!(value instanceof List<?> rawItems)) {
            return List.of();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object item : rawItems) {
            result.add(asMap(item));
        }
        return result;
    }

    private Map<String, Object> asMap(Object value) {
        if (!(value instanceof Map<?, ?> rawMap)) {
            return Map.of();
        }

        LinkedHashMap<String, Object> map = new LinkedHashMap<>();
        for (Map.Entry<?, ?> entry : rawMap.entrySet()) {
            if (entry.getKey() != null) {
                map.put(String.valueOf(entry.getKey()), entry.getValue());
            }
        }
        return map;
    }

    private String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return "";
    }

    private String summarizeText(String text, int maxLength) {
        String normalized = normalizeWhitespace(text);
        if (normalized.isBlank()) {
            return "";
        }

        int sentenceEnd = normalized.indexOf(". ");
        if (sentenceEnd > 0 && sentenceEnd + 1 <= maxLength) {
            return ensureSentenceEnding(normalized.substring(0, sentenceEnd + 1));
        }

        if (normalized.length() <= maxLength) {
            return ensureSentenceEnding(normalized);
        }

        return ensureSentenceEnding(truncateAtWordBoundary(normalized, maxLength));
    }

    private String truncateAtWordBoundary(String text, int maxLength) {
        String normalized = normalizeWhitespace(text);
        if (normalized.length() <= maxLength) {
            return normalized;
        }

        int boundary = normalized.lastIndexOf(' ', maxLength);
        if (boundary < maxLength / 2) {
            boundary = maxLength;
        }
        return normalized.substring(0, boundary).trim();
    }

    private String safeJoinSentences(String... parts) {
        List<String> values = Arrays.stream(parts)
            .map(this::normalizeWhitespace)
            .filter(value -> !value.isBlank())
            .map(this::ensureSentenceEnding)
            .distinct()
            .limit(3)
            .toList();

        return String.join(" ", values);
    }

    private String ensureSentenceEnding(String value) {
        String normalized = normalizeWhitespace(value);
        if (normalized.isBlank()) {
            return "";
        }

        char lastChar = normalized.charAt(normalized.length() - 1);
        if (lastChar == '.' || lastChar == '!' || lastChar == '?') {
            return normalized;
        }
        return normalized + ".";
    }

    private String normalizeWhitespace(String value) {
        if (value == null) {
            return "";
        }
        return value.replaceAll("\\s+", " ").trim();
    }

    private String safeValue(String value) {
        return value == null ? "" : value.trim();
    }

    private List<String> limitDistinctNonBlank(List<String> values, int maxItems) {
        LinkedHashSet<String> unique = new LinkedHashSet<>();
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                unique.add(value.trim());
            }
            if (unique.size() == maxItems) {
                break;
            }
        }
        return new ArrayList<>(unique);
    }

    private String joinNaturalLanguageList(List<String> items) {
        if (items == null || items.isEmpty()) {
            return "";
        }
        if (items.size() == 1) {
            return items.getFirst();
        }
        if (items.size() == 2) {
            return items.get(0) + " and " + items.get(1);
        }

        return String.join(", ", items.subList(0, items.size() - 1))
            + ", and "
            + items.get(items.size() - 1);
    }

    private KnowledgeEntry createKnowledgeEntry(
        String type,
        String title,
        String answer,
        String searchText,
        int priority
    ) {
        return new KnowledgeEntry(
            type,
            firstNonBlank(title, "Veagle Space"),
            ensureSentenceEnding(answer),
            normalizeMessage(firstNonBlank(searchText, title + " " + answer)),
            priority
        );
    }

    private static Map<String, String> createStrictQueryResponses() {
        Map<String, String> responses = new LinkedHashMap<>();
        responses.put("how can i get a project quote", QUOTE_REPLY);
        responses.put("do you develop mobile apps", MOBILE_REPLY);
        responses.put("how do i apply for a job", CAREER_REPLY);
        responses.put("where are you located", LOCATION_REPLY);
        responses.put("how can i contact you", CONTACT_REPLY);
        responses.put("what is your address", LOCATION_REPLY);
        responses.put("where is your office", LOCATION_REPLY);
        responses.put("what is your phone number", CONTACT_REPLY);
        responses.put("what is your email", CONTACT_REPLY);
        return responses;
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

    private record FaqEntry(String question, String answer) {
    }

    private record KnowledgeEntry(
        String type,
        String title,
        String answer,
        String normalizedSearchText,
        int priority
    ) {
    }

    private record KnowledgeMatch(KnowledgeEntry entry, int score) {
    }

    private record KnowledgeSnapshot(
        List<KnowledgeEntry> entries,
        String servicesCatalogReply,
        String productsCatalogReply,
        String portfolioReply,
        String companyOverviewReply
    ) {
    }
}
