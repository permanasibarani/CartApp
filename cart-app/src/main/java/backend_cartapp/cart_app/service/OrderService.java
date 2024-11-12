package backend_cartapp.cart_app.service;

import backend_cartapp.cart_app.model.OrderResponse;
import backend_cartapp.cart_app.entity.Order;
import backend_cartapp.cart_app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<OrderResponse> getOrdersByUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Order> orderPage = orderRepository.findByUser_Username (username, pageable);

        return orderPage.stream().map(order -> {
            return new OrderResponse(
                    order.getOrder_id(),
                    order.getOrderDate(),
                    order.getTotalPrice()
            );
        }).collect(Collectors.toList());
    }
}
