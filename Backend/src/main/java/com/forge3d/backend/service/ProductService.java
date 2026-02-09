package com.forge3d.backend.service;

import com.forge3d.backend.exception.ResourceNotFoundException;
import com.forge3d.backend.model.Product;
import com.forge3d.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
    
    // Add logic needed for DataSeeder and Admin
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product addProduct(Product product) {
        // Ensure new products are not archived by default unless specified
        if (product.getIsArchived() == null) {
            product.setIsArchived(false);
        }
        return productRepository.save(product);
    }

    public Product toggleProductStatus(Long id) {
        Product product = getProductById(id);
        product.setIsArchived(!product.getIsArchived());
        return productRepository.save(product);
    }
}
