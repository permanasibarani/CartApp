package backend_cartapp.cart_app.controller;

import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.*;
import backend_cartapp.cart_app.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping(
            path = "api/v1/cart",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public WebResponse<CartResponse> create(User user, @RequestBody CreateCartRequest request){
        CartResponse productResponse = cartService.create(user, request);
        return WebResponse.<CartResponse>builder().data(productResponse).build();
    }

    @GetMapping(
            path = "api/v1/cart/all",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public WebResponse<List<CartResponseDTO>> getAllProducts(@RequestParam String username,  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        // Ambil cart data berdasarkan username dengan pagination
        Page<CartResponseDTO> carts = cartService.getCartsByUsername(username, page, size);

        // Kembalikan response dengan data cart
        return WebResponse.<List<CartResponseDTO>>builder()
                .data(carts.getContent())
                .build();
    }

    @PostMapping("api/v1/cart/checkout")
    public WebResponse<String> checkout(@RequestBody CheckoutRequest request) {
        // Panggil service checkout untuk memproses
        cartService.checkout(request);

        // Mengembalikan response sukses
        return WebResponse.<String>builder()
                .data("Checkout successful")
                .build();
    }
}
