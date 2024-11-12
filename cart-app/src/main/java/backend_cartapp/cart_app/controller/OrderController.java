package backend_cartapp.cart_app.controller;
import backend_cartapp.cart_app.model.OrderResponse;
import backend_cartapp.cart_app.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;
    @GetMapping("/api/v1/orders/{username}")
    public List<OrderResponse> getOrdersByUsername(
            @PathVariable("username") String username,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return orderService.getOrdersByUsername(username, page, size);
    }
}
