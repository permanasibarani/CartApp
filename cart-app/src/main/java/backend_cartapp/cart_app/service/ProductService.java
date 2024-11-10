package backend_cartapp.cart_app.service;

import backend_cartapp.cart_app.entity.Product;
import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.CreateProductRequest;
import backend_cartapp.cart_app.model.ProductResponse;
import backend_cartapp.cart_app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ValidationService validationService;

    public ProductResponse create(User user, CreateProductRequest request) {
        validationService.validate(request);

        // Cek apakah produk dengan nama yang sama sudah ada
        Optional<Product> existingProduct = productRepository.findByNameIgnoreCase(request.getName());

        Product product;

        if (existingProduct.isPresent()) {
            // Jika produk sudah ada, ambil produk yang ada dan perbarui stock dan price
            product = existingProduct.get();
            product.setStock(request.getStock() != null ? request.getStock() : 0);
            product.setPrice(request.getPrice() != null ? request.getPrice() : 0);

            // Simpan perubahan
            product = productRepository.save(product);
        } else {
            // Jika produk belum ada, buat produk baru
            product = new Product();
            product.setName(request.getName());
            product.setSku(request.getSku());
            product.setStock(request.getStock() != null ? request.getStock() : 0); // Default ke 0 jika null
            product.setType(request.getType());
            product.setPrice(request.getPrice() != null ? request.getPrice() : 0); // Default ke 0 jika null

            // Simpan produk baru
            product = productRepository.save(product);
        }

        // Return response dengan data produk
        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .sku(product.getSku())
                .stock(product.getStock())
                .type(product.getType())
                .price(product.getPrice())
                .build();
    }

    public List<ProductResponse> getAllProducts(User user) {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> new ProductResponse(
                        product.getProductId(),
                        product.getName(),
                        product.getSku(),
                        product.getStock(),
                        product.getType(),
                        product.getPrice()))
                .collect(Collectors.toList());
    }
}
