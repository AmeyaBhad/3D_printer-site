package com.forge3d.backend.config;

import com.forge3d.backend.model.Product;
import com.forge3d.backend.model.ProductAnalytics;
import com.forge3d.backend.model.User;
import com.forge3d.backend.repository.ProductRepository;
import com.forge3d.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
        seedUsers();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@3dforge.com")) {
            User admin = new User();
            admin.setEmail("admin@3dforge.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setDisplayName("Admin");
            admin.setRole(User.Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("Data Seeder: Seeded Admin User.");
        }

        if (!userRepository.existsByEmail("user@3dforge.com")) {
            User user = new User();
            user.setEmail("user@3dforge.com");
            user.setPassword(passwordEncoder.encode("password"));
            user.setDisplayName("User");
            user.setRole(User.Role.USER);
            
            userRepository.save(user);
            System.out.println("Data Seeder: Seeded Standard User.");
        }
    }

    private void seedProducts() {
        // Product 1
        Product p1 = new Product();
        p1.setName("Articulated Dragon");
        p1.setCategory("Toys");
        p1.setPrice(45.00);
        p1.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Dragon");
        p1.setStock(10);
        p1.setDescription("A fully articulated dragon model, perfect for play or display. Features intricate details and smooth joint movement.");
        p1.setIsArchived(false);

        ProductAnalytics a1 = new ProductAnalytics();
        a1.setViews(1200);
        a1.setLikes(150);
        a1.setRating(4.8);
        a1.setRevenue(4500.0);
        a1.setUnitsSold(100);
        a1.setSalesData(java.util.List.of(10, 15, 8, 20, 25, 30, 45));
        p1.setAnalytics(a1);

        // Product 2
        Product p2 = new Product();
        p2.setName("Voronoi Vase");
        p2.setCategory("Home Decor");
        p2.setPrice(25.00);
        p2.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Vase");
        p2.setStock(5);
        p2.setDescription("A stunning Voronoi-style vase that adds a modern touch to any room. 3D printed with high-quality PLA.");
        p2.setIsArchived(false);

        ProductAnalytics a2 = new ProductAnalytics();
        a2.setViews(800);
        a2.setLikes(90);
        a2.setRating(4.5);
        a2.setRevenue(2000.0);
        a2.setUnitsSold(80);
        a2.setSalesData(java.util.List.of(5, 8, 12, 10, 15, 18, 22));
        p2.setAnalytics(a2);

        // Product 3
        Product p3 = new Product();
        p3.setName("Mechanical Clock");
        p3.setCategory("Gadgets");
        p3.setPrice(120.00);
        p3.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Clock");
        p3.setStock(0); // Made to order
        p3.setDescription("A functional mechanical clock showcasing the beauty of gears and engineering. Assembly required.");
        p3.setIsArchived(false);

        ProductAnalytics a3 = new ProductAnalytics();
        a3.setViews(2500);
        a3.setLikes(300);
        a3.setRating(4.9);
        a3.setRevenue(1200.0);
        a3.setUnitsSold(10);
        a3.setSalesData(java.util.List.of(0, 2, 1, 5, 3, 8, 10));
        p3.setAnalytics(a3);

        // Product 4
        Product p4 = new Product();
        p4.setName("Lithophane Lamp");
        p4.setCategory("Home Decor");
        p4.setPrice(60.00);
        p4.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Lamp");
        p4.setStock(2);
        p4.setDescription("Customizable lithophane lamp that reveals a hidden image when lit. Perfect for personalized gifts.");
        p4.setIsArchived(false);

        ProductAnalytics a4 = new ProductAnalytics();
        a4.setViews(1500);
        a4.setLikes(200);
        a4.setRating(4.7);
        a4.setRevenue(3000.0);
        a4.setUnitsSold(50);
        a4.setSalesData(java.util.List.of(2, 5, 4, 8, 10, 12, 15));
        p4.setAnalytics(a4);

        // Product 5
        Product p5 = new Product();
        p5.setName("Phone Stand");
        p5.setCategory("Accessories");
        p5.setPrice(15.00);
        p5.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Stand");
        p5.setStock(20);
        p5.setDescription("Ergonomic phone stand suitable for all smartphones. Great for video calls and watching media.");
        p5.setIsArchived(false);

        ProductAnalytics a5 = new ProductAnalytics();
        a5.setViews(500);
        a5.setLikes(50);
        a5.setRating(4.4);
        a5.setRevenue(1500.0);
        a5.setUnitsSold(100);
        a5.setSalesData(java.util.List.of(20, 25, 30, 28, 35, 40, 50));
        p5.setAnalytics(a5);

        // Product 6
        Product p6 = new Product();
        p6.setName("Custom Keychain");
        p6.setCategory("Accessories");
        p6.setPrice(8.00);
        p6.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Keychain");
        p6.setStock(50);
        p6.setDescription("Durable and stylish custom keychains. Available in various colors and designs.");
        p6.setIsArchived(false);

        ProductAnalytics a6 = new ProductAnalytics();
        a6.setViews(300);
        a6.setLikes(40);
        a6.setRating(4.2);
        a6.setRevenue(800.0);
        a6.setUnitsSold(100);
        a6.setSalesData(java.util.List.of(10, 12, 15, 20, 25, 30, 35));
        p6.setAnalytics(a6);
        
        // Product 7
        Product p7 = new Product();
        p7.setName("Planter Pot");
        p7.setCategory("Home Decor");
        p7.setPrice(18.00);
        p7.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Pot");
        p7.setStock(15);
        p7.setDescription("Geometric planter pot designed for succulents and small plants. Includes drainage holes.");
        p7.setIsArchived(false);

        ProductAnalytics a7 = new ProductAnalytics();
        a7.setViews(600);
        a7.setLikes(60);
        a7.setRating(4.6);
        a7.setRevenue(1800.0);
        a7.setUnitsSold(100);
        a7.setSalesData(java.util.List.of(5, 10, 8, 12, 15, 20, 25));
        p7.setAnalytics(a7);

        // Product 8
        Product p8 = new Product();
        p8.setName("Headphone Stand");
        p8.setCategory("Gadgets");
        p8.setPrice(35.00);
        p8.setImage("https://placehold.co/400x400/2d3748/ffffff?text=Headphone+Stand");
        p8.setStock(8);
        p8.setDescription("Sleek headphone stand to keep your desk organized. Compatible with all over-ear headphones.");
        p8.setIsArchived(false);

        ProductAnalytics a8 = new ProductAnalytics();
        a8.setViews(1000);
        a8.setLikes(110);
        a8.setRating(4.8);
        a8.setRevenue(3500.0);
        a8.setUnitsSold(100);
        a8.setSalesData(java.util.List.of(8, 10, 12, 15, 18, 20, 25));
        p8.setAnalytics(a8);

        productRepository.saveAll(java.util.List.of(p1, p2, p3, p4, p5, p6, p7, p8));
        System.out.println("Data Seeder: Seeded " + productRepository.count() + " products.");
    }
}
