package backend_cartapp.cart_app.model;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter

public class CheckoutRequest {
    private String username;
    private List<ProductCheckoutRequest> data;

    // Getters and setters
    @Getter
    @Setter
    public static class ProductCheckoutRequest {
        private String name;
        private Integer qty;
    }
}
