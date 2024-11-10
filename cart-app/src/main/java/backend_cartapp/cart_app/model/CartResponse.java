package backend_cartapp.cart_app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {

    private Long cart_id;
    private String name;
    private String type;
    private Integer qty;
    private Integer price;
    private Integer total_price;
}
