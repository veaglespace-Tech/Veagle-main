package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.FeatureResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ProductResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ChatBotServiceTest {

    private final ChatBotService chatBotService = new ChatBotService();

    @Test
    void returnsStrictLocationAnswerForExactLocationQuestion() {
        ChatResponseDTO response = chatBotService.chat("Where are you located?", false);

        assertEquals(
            "Veagle Space is located at Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune, Maharashtra 411041.",
            response.getAnswer()
        );
        assertEquals("high", response.getConfidence());
        assertFalse(response.isShowForm());
    }

    @Test
    void returnsStrictContactAnswerForExactContactQuestion() {
        ChatResponseDTO response = chatBotService.chat("How can I contact you?", false);

        assertEquals(
            "You can reach Veagle Space through the Contact page, email info@veaglespace.com, or call +91 82379 99101.",
            response.getAnswer()
        );
        assertEquals("high", response.getConfidence());
        assertFalse(response.isShowForm());
    }

    @Test
    void keepsSupportFormHiddenForLoggedOutOffTopicUsers() {
        ChatResponseDTO response = chatBotService.chat("Who won the cricket match?", false);

        assertEquals(
            "I'm not familiar with that topic. I can help with Veagle Space services, careers, support, products, portfolio, and contact details.",
            response.getAnswer()
        );
        assertEquals("low", response.getConfidence());
        assertFalse(response.isShowForm());
    }

    @Test
    void showsSupportFormForLoggedInOffTopicUsers() {
        ChatResponseDTO response = chatBotService.chat("Who won the cricket match?", true);

        assertTrue(response.isShowForm());
        assertEquals("low", response.getConfidence());
    }

    @Test
    void answersFaqStyleProjectQuestionUsingGroundedKnowledge() {
        ChatResponseDTO response = chatBotService.chat("Will you improve SEO during website redesign?", false);

        assertEquals(
            "Yes. We improve page structure, headings, metadata, internal linking, crawlability, schema support and keyword-focused content while redesigning the website.",
            response.getAnswer()
        );
        assertEquals("high", response.getConfidence());
        assertFalse(response.isShowForm());
    }

    @Test
    void answersSpecificServiceQuestionsFromCurrentProjectData() {
        ChatBotService service = createProjectAwareChatBotService();

        ChatResponseDTO response = service.chat("Tell me about Satellite Operations Dashboard", false);

        assertTrue(response.getAnswer().contains("Satellite Operations Dashboard"));
        assertTrue(response.getAnswer().contains("real-time fleet visibility"));
        assertTrue(response.getAnswer().contains("info@veaglespace.com"));
        assertEquals("high", response.getConfidence());
    }

    @Test
    void answersProductCatalogQuestionsFromCurrentProjectData() {
        ChatBotService service = createProjectAwareChatBotService();

        ChatResponseDTO response = service.chat("What products do you have?", false);

        assertTrue(response.getAnswer().contains("OrbitOps Suite"));
        assertTrue(response.getAnswer().contains("Signal Desk"));
        assertTrue(response.getAnswer().contains("categories like Aerospace Platforms and Mission Control"));
        assertEquals("high", response.getConfidence());
    }

    private ChatBotService createProjectAwareChatBotService() {
        return new ChatBotService() {
            @Override
            protected Map<String, Object> getSiteContentSnapshot() {
                return Map.of(
                    "faq", List.of(
                        Map.of(
                            "question", "Do you build control rooms?",
                            "answer", "Yes. We design dashboard-driven control rooms with live monitoring, alerts and operator workflows."
                        )
                    )
                );
            }

            @Override
            protected List<ServicesResponseDTO> getServicesSnapshot() {
                return List.of(
                    new ServicesResponseDTO(
                        1L,
                        "Satellite Operations Dashboard",
                        "A monitoring and control workspace for real-time fleet visibility and operator workflows.",
                        "Mission control delivery",
                        "Teams use it to manage telemetry, alerts and workflow approvals from one place.",
                        "Role-based dashboard with reporting and integration support.",
                        "https://example.com/service.png",
                        List.of(
                            new FeatureResponseDTO(1L, "Telemetry monitoring"),
                            new FeatureResponseDTO(2L, "Alert workflows")
                        )
                    )
                );
            }

            @Override
            protected List<ProductResponseDTO> getProductsSnapshot() {
                return List.of(
                    new ProductResponseDTO(
                        10L,
                        "OrbitOps Suite",
                        "An operations platform for mission planning, telemetry review and handoff tracking.",
                        "https://example.com/product-1.png",
                        "Aerospace Platforms",
                        true
                    ),
                    new ProductResponseDTO(
                        11L,
                        "Signal Desk",
                        "A response console for support teams managing escalations and incident workflows.",
                        "https://example.com/product-2.png",
                        "Mission Control",
                        true
                    )
                );
            }

            @Override
            protected List<PortfolioResponseDTO> getPortfolioSnapshot() {
                return List.of(
                    new PortfolioResponseDTO(
                        100L,
                        "Ground Console Revamp",
                        "A redesign focused on faster operator workflows and clearer alert states.",
                        "https://example.com/portfolio.png",
                        "https://example.com/project",
                        "https://github.com/example/project"
                    )
                );
            }
        };
    }
}
