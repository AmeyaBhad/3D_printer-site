package com.printeddimensions.backend.service;

import com.printeddimensions.backend.model.User;
import com.printeddimensions.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

/**
 * Verifies Google "Sign in with Google" credentials by calling Google's tokeninfo endpoint
 * and then finds-or-creates a local user. Avoids pulling in the google-api-client dependency
 * because tokeninfo is a single HTTPS GET; Google performs the signature + expiry check for us.
 */
@Service
public class GoogleAuthService {

    private static final String TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestClient http = RestClient.builder().build();

    @Value("${google.client-id:}")
    private String configuredClientId;

    public GoogleAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User loginOrRegister(String idToken) {
        Map<String, Object> body;
        try {
            body = http.get()
                    .uri(TOKENINFO_URL + "?id_token=" + idToken)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {
                        throw new IllegalArgumentException("Google rejected the credential (HTTP " + res.getStatusCode().value() + ")");
                    })
                    .body(Map.class);
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Could not verify Google credential: " + ex.getMessage());
        }

        if (body == null) {
            throw new IllegalArgumentException("Empty response from Google tokeninfo");
        }

        // Required claims
        String email = asString(body.get("email"));
        String emailVerified = asString(body.get("email_verified"));
        String audience = asString(body.get("aud"));
        String name = asString(body.get("name"));
        String givenName = asString(body.get("given_name"));

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google credential did not include an email");
        }
        if (emailVerified != null && emailVerified.equalsIgnoreCase("false")) {
            throw new IllegalArgumentException("Google account email is not verified");
        }
        if (configuredClientId != null && !configuredClientId.isBlank()) {
            if (audience == null || !audience.equals(configuredClientId)) {
                throw new IllegalArgumentException("Google credential audience does not match this app's client id");
            }
        }

        String displayName = name != null && !name.isBlank() ? name
                : (givenName != null && !givenName.isBlank() ? givenName : email);

        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            // Random password: Google-only accounts can still authenticate via /auth/google,
            // but cannot login with email+password unless they set one later.
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setDisplayName(displayName);
            user.setRole(User.Role.USER);
            return userRepository.save(user);
        });
    }

    private static String asString(Object o) {
        return o == null ? null : o.toString();
    }
}
