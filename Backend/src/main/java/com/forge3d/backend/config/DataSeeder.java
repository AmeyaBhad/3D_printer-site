package com.forge3d.backend.config;

import com.forge3d.backend.model.Product;
import com.forge3d.backend.model.ProductAnalytics;
import com.forge3d.backend.model.User;
import com.forge3d.backend.repository.ProductRepository;
import com.forge3d.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        seedUsers();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@3dforge.com")) {
            User admin = User.builder()
                    .email("admin@3dforge.com")
                    .password(passwordEncoder.encode("admin123"))
                    .displayName("Admin")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Data Seeder: Seeded Admin User.");
        }

        if (!userRepository.existsByEmail("user@3dforge.com")) {
            User user = User.builder()
                    .email("user@3dforge.com")
                    .password(passwordEncoder.encode("password"))
                    .displayName("User")
                    .role(User.Role.USER)
                    .build();
            userRepository.save(user);
            System.out.println("Data Seeder: Seeded Standard User.");
        }
    }

    private void seedProducts() {
        Product p1 = Product.builder()
                .name("Articulated Dragon")
                .category("Toys")
                .price(45.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Dragon")
                .stock(10)
                .description("A magnificent articulated dragon with movable joints.")
                .analytics(ProductAnalytics.builder().views(1200).likes(150).rating(4.8).build())
                .isArchived(false)
                .build();

        Product p2 = Product.builder()
                .name("Voronoi Vase")
                .category("Home Decor")
                .price(25.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Vase")
                .stock(5)
                .description("Elegant voronoi pattern vase for modern homes.")
                .analytics(ProductAnalytics.builder().views(800).likes(90).rating(4.5).build())
                .isArchived(false)
                .build();

        Product p3 = Product.builder()
                .name("Mechanical Clock")
                .category("Gadgets")
                .price(120.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Clock")
                .stock(0) // Made to order
                .description("Fully functional 3D printed mechanical clock.")
                .analytics(ProductAnalytics.builder().views(2500).likes(300).rating(4.9).build())
                .isArchived(false)
                .build();

        Product p4 = Product.builder()
                .name("Lithophane Lamp")
                .category("Home Decor")
                .price(60.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Lamp")
                .stock(2)
                .description("Customizable lithophane lamp box.")
                .analytics(ProductAnalytics.builder().views(1500).likes(200).rating(4.7).build())
                .isArchived(false)
                .build();

        Product p5 = Product.builder()
                .name("Phone Stand")
                .category("Accessories")
                .price(15.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Stand")
                .stock(20)
                .description("Minimalist phone stand for desk setup.")
                .analytics(ProductAnalytics.builder().views(500).likes(50).rating(4.4).build())
                .isArchived(false)
                .build();

        Product p6 = Product.builder()
                .name("Custom Keychain")
                .category("Accessories")
                .price(8.00)
                .image("https://placehold.co/400x400/2d3748/ffffff?text=Keychain")
                .stock(50)
                .description("Personalized 3D printed keychains.")
                .analytics(ProductAnalytics.builder().views(300).likes(40).rating(4.2).build())
                .isArchived(false)
                .build();

        productRepository.saveAll(java.util.List.of(p1, p2, p3, p4, p5, p6));
        System.out.println("Data Seeder: Seeded " + productRepository.count() + " products.");
    }
}
