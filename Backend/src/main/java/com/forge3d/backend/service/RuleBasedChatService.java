package com.forge3d.backend.service;

import com.forge3d.backend.dto.ChatResponse;
import com.forge3d.backend.model.Product;
import com.forge3d.backend.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Simple intent-matching chatbot. Order of checks matters — most specific intents
 * are evaluated first. Knows the real product catalog so price/stock questions
 * answer with live data.
 *
 * Designed to be replaced by an LLM-backed ChatService later: just provide another
 * @Service implementing ChatService and mark this one with @ConditionalOnMissingBean.
 */
@Service
public class RuleBasedChatService implements ChatService {

    private static final List<String> DEFAULT_SUGGESTIONS = List.of(
            "Show me products", "Shipping info", "Custom orders", "Contact"
    );

    private final ProductRepository productRepository;

    public RuleBasedChatService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ChatResponse reply(String userMessage) {
        String msg = userMessage == null ? "" : userMessage.toLowerCase(Locale.ROOT).trim();

        if (msg.isEmpty()) {
            return msg("Tell me what you're looking for — products, prices, shipping, or anything else about 3DForge.");
        }

        // Greetings
        if (containsAny(msg, "hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste")) {
            return msg("Hi there! 👋 I'm Forge, your 3DForge assistant. What can I help you with?", DEFAULT_SUGGESTIONS);
        }

        // Goodbye / thanks
        if (containsAny(msg, "bye", "goodbye", "see you", "thanks", "thank you", "thx")) {
            return msg("Happy to help! Come back anytime. 🛠️");
        }

        // Help
        if (containsAny(msg, "help", "what can you do", "what do you do", "options", "menu")) {
            return msg("I can help with:\n• Finding products and prices\n• Stock availability\n• Shipping and delivery\n• Custom orders\n• Contact info\nWhat would you like to know?", DEFAULT_SUGGESTIONS);
        }

        // Contact
        if (containsAny(msg, "contact", "phone", "email", "address", "where are you", "location")) {
            return msg("You can reach us at:\n📞 +91 9657111331\n📧 contact@3dforge.com\n📍 New Sangvi, Pimple Gurva, Pune, Maharashtra 411027");
        }

        // Shipping / delivery
        if (containsAny(msg, "shipping", "delivery", "deliver", "ship", "courier", "when will", "how long")) {
            return msg("We ship across India. In-stock items dispatch within 1–2 business days; delivery takes 3–6 days. Made-to-order pieces take an extra 5–10 days. We'll send tracking info by email.");
        }

        // Payment methods
        if (containsAny(msg, "payment method", "how to pay", "pay with", "upi", "credit card", "debit card", "razorpay", "cash on delivery")) {
            return msg("We accept all major payment methods via Razorpay: UPI, credit/debit cards, net banking, and popular wallets. Checkout is secure end-to-end.");
        }

        // Custom orders
        if (containsAny(msg, "custom", "made to order", "design my own", "personalized", "bespoke", "commission")) {
            return msg("Yes! We do custom 3D prints. Send your idea (sketches, reference images, or an STL file) to contact@3dforge.com or via the Contact page and we'll get back with a quote.");
        }

        // Returns
        if (containsAny(msg, "return", "refund", "exchange")) {
            return msg("Standard items can be returned within 7 days if unused and in original packaging. Custom and made-to-order pieces are non-refundable. Email contact@3dforge.com to start a return.");
        }

        // Account / login
        if (containsAny(msg, "login", "sign in", "sign up", "register", "account", "password")) {
            return msg("Click the Login button at the top right to sign in or create an account. You can also use Sign in with Google for instant access.");
        }

        // Order tracking
        if (containsAny(msg, "track", "order status", "where is my order", "my order")) {
            return msg("Open your Profile page (top-right after login) and head to **My Orders** to see status and items for every order you've placed.");
        }

        // Product / catalog queries — try to match a real product
        List<Product> matches = findMatchingProducts(msg);
        if (!matches.isEmpty()) {
            boolean priceIntent = containsAny(msg, "price", "cost", "how much", "rate");
            boolean stockIntent = containsAny(msg, "stock", "available", "have it", "in stock");

            StringBuilder sb = new StringBuilder();
            if (priceIntent) {
                sb.append("Here are the prices I found:\n");
                for (Product p : matches) {
                    sb.append(String.format("• %s — ₹%.2f%n", p.getName(), p.getPrice()));
                }
            } else if (stockIntent) {
                sb.append("Stock status:\n");
                for (Product p : matches) {
                    sb.append(p.getStock() != null && p.getStock() > 0
                            ? String.format("• %s — %d in stock (₹%.2f)%n", p.getName(), p.getStock(), p.getPrice())
                            : String.format("• %s — Made to order (₹%.2f)%n", p.getName(), p.getPrice()));
                }
            } else {
                sb.append("I found these matching products:\n");
                for (Product p : matches) {
                    sb.append(String.format("• %s — ₹%.2f%n", p.getName(), p.getPrice()));
                }
                sb.append("\nBrowse the Products page to see images and details.");
            }
            return msg(sb.toString().trim(), List.of("Show me products", "Shipping info"));
        }

        // Generic product list (when user just asks to "show products")
        if (containsAny(msg, "product", "catalog", "collection", "what do you sell", "what do you have", "show me")) {
            List<Product> sample = productRepository.findAll().stream()
                    .filter(p -> p.getIsArchived() == null || !p.getIsArchived())
                    .limit(5)
                    .toList();
            StringBuilder sb = new StringBuilder("Here's a peek at our collection:\n");
            for (Product p : sample) {
                sb.append(String.format("• %s — ₹%.2f%n", p.getName(), p.getPrice()));
            }
            sb.append("\nVisit the Products page for the full catalog.");
            return msg(sb.toString().trim(), DEFAULT_SUGGESTIONS);
        }

        // Fallback
        return msg(
                "I'm not sure I caught that. Try asking about products, prices, shipping, custom orders, or contact info — or tap a suggestion below.",
                DEFAULT_SUGGESTIONS
        );
    }

    /** Match the message against product names (token overlap). */
    private List<Product> findMatchingProducts(String msg) {
        List<Product> result = new ArrayList<>();
        List<Product> all = productRepository.findAll();
        for (Product p : all) {
            if (p.getIsArchived() != null && p.getIsArchived()) continue;
            String name = p.getName() == null ? "" : p.getName().toLowerCase(Locale.ROOT);
            String category = p.getCategory() == null ? "" : p.getCategory().toLowerCase(Locale.ROOT);
            // Token-by-token match: any product-name token >= 4 chars present in the message
            for (String token : name.split("\\s+")) {
                if (token.length() >= 4 && msg.contains(token)) {
                    result.add(p);
                    break;
                }
            }
            if (!result.contains(p) && category.length() >= 4 && msg.contains(category)) {
                result.add(p);
            }
        }
        return result.size() > 6 ? result.subList(0, 6) : result;
    }

    private static boolean containsAny(String haystack, String... needles) {
        for (String n : needles) {
            if (haystack.contains(n)) return true;
        }
        return false;
    }

    private static ChatResponse msg(String text) {
        return new ChatResponse(text, null);
    }
    private static ChatResponse msg(String text, List<String> suggestions) {
        return new ChatResponse(text, suggestions);
    }
}
