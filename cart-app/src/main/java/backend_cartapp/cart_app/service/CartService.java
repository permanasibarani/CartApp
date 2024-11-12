package backend_cartapp.cart_app.service;

import backend_cartapp.cart_app.entity.Cart;
import backend_cartapp.cart_app.entity.Product;
import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.entity.Order;
import backend_cartapp.cart_app.model.CartResponse;
import backend_cartapp.cart_app.model.CartResponseDTO;
import backend_cartapp.cart_app.model.CheckoutRequest;
import backend_cartapp.cart_app.model.CreateCartRequest;
import backend_cartapp.cart_app.repository.CartRepository;
import backend_cartapp.cart_app.repository.OrderRepository;
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

import java.util.Date;
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
    private OrderRepository orderRepository;

    @Autowired
    private ValidationService validationService;

    @Transactional
    public CartResponse create(User user, CreateCartRequest request) {
        validationService.validate(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        User users = userRepository.findById(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Username not found"));

        Optional<Cart> existingCart = cartRepository.findByProductAndUserAndStatus(product, users, request.getStatus());

        if (existingCart.isPresent()) {
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
        Pageable pageable = PageRequest.of(page, size);
        return cartRepository.findByUsername(username, pageable);
    }

    @Transactional
    public void checkout(CheckoutRequest request) {
        User user = userRepository.findById(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Order order = new Order();
        int totalPrice = 0;

        order.setUser(user);
        order.setOrderDate(new Date());

        orderRepository.save(order);

        for (CheckoutRequest.ProductCheckoutRequest productRequest : request.getData()) {
            // Cari cart yang sesuai dengan username dan nama produk
            List<Cart> carts = cartRepository.findByUsernameAndProductName(user.getUsername(), productRequest.getName());

            if (carts.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart for product " + productRequest.getName() + " not found");
            }

            // Update status cart menjadi 1 dan set order_id
            for (Cart cart : carts) {
                cart.setStatus(1); // Status 1 untuk checkout
                cart.setOrder(order); // Menambahkan relasi dengan order
                cartRepository.save(cart);  // Simpan perubahan pada Cart
            }

            Product product = productRepository.findByNameIgnoreCase(productRequest.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            int newStock = product.getStock() - productRequest.getQty();
            if (newStock < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for product " + productRequest.getName());
            }

            product.setStock(newStock);
            productRepository.save(product);

            totalPrice += productRequest.getQty() * product.getPrice();
        }

        order.setTotalPrice(totalPrice);

        orderRepository.save(order);
    }

    @Transactional
    public void deleteCart(Long cartId, String username) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        if (!cart.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This cart does not belong to the user");
        }

        cartRepository.delete(cart);
    }
}
