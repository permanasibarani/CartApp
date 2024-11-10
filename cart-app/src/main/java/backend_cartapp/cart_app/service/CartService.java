package backend_cartapp.cart_app.service;

import backend_cartapp.cart_app.entity.Cart;
import backend_cartapp.cart_app.entity.Product;
import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.CartResponse;
import backend_cartapp.cart_app.model.CartResponseDTO;
import backend_cartapp.cart_app.model.CheckoutRequest;
import backend_cartapp.cart_app.model.CreateCartRequest;
import backend_cartapp.cart_app.repository.CartRepository;
import backend_cartapp.cart_app.repository.ProductRepository;
import backend_cartapp.cart_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Transactional
    public CartResponse create(User user, CreateCartRequest request) {
        validationService.validate(request);

        // Mencari produk berdasarkan productId
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Mencari pengguna berdasarkan username
        User users = userRepository.findById(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Username not found"));

        // Mencari cart berdasarkan kombinasi product, username, dan status
        Optional<Cart> existingCart = cartRepository.findByProductAndUserAndStatus(product, users, request.getStatus());

        if (existingCart.isPresent()) {
            // Jika sudah ada cart, perbarui qty dan price
            Cart cart = existingCart.get();
            cart.setQty(cart.getQty() + request.getQty()); // Tambahkan qty yang ada dengan qty baru
            cart.setPrice(cart.getQty() * product.getPrice()); // Hitung total price berdasarkan qty dan price produk
            Cart updatedCart = cartRepository.save(cart); // Simpan perubahan cart yang sudah diperbarui

            return CartResponse.builder()
                    .cart_id(updatedCart.getCart_id())
                    .qty(updatedCart.getQty())
                    .price(updatedCart.getPrice())
                    .total_price(updatedCart.getQty() * updatedCart.getPrice())
                    .build();
        } else {
            // Jika cart belum ada, buat entri baru
            Integer totalPrice = request.getQty() * product.getPrice();

            Cart cart = new Cart();
            cart.setProduct(product);
            cart.setUser(users);
            cart.setQty(request.getQty() != null ? request.getQty() : 1);
            cart.setPrice(totalPrice);
            cart.setStatus(request.getStatus() != null ? request.getStatus() : 0);
            Cart savedCart = cartRepository.save(cart);

            return CartResponse.builder()
                    .cart_id(savedCart.getCart_id())
                    .qty(savedCart.getQty())
                    .price(savedCart.getPrice())
                    .total_price(savedCart.getQty() * savedCart.getPrice())
                    .build();
        }
    }
    public Page<CartResponseDTO> getCartsByUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Pagination setup
        return cartRepository.findByUsername(username, pageable); // Call repository method
    }

    @Transactional
    public void checkout(CheckoutRequest request) {
        // Cek apakah user ada
        User user = userRepository.findById(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Iterasi melalui produk yang ada di request
        for (CheckoutRequest.ProductCheckoutRequest productRequest : request.getData()) {
            // Cari cart yang sesuai dengan username dan nama produk
            List<Cart> carts = cartRepository.findByUsernameAndProductName(user.getUsername(), productRequest.getName());

            if (carts.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart for product " + productRequest.getName() + " not found");
            }

            // Update status cart menjadi 1
            for (Cart cart : carts) {
                cart.setStatus(1); // Status 1 untuk checkout
                cartRepository.save(cart);
            }

            // Kurangi stock produk
            Product product = productRepository.findByNameIgnoreCase(productRequest.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            int newStock = product.getStock() - productRequest.getQty();
            if (newStock < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for product " + productRequest.getName());
            }

            product.setStock(newStock);
            productRepository.save(product);
        }
    }
}
