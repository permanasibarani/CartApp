package backend_cartapp.cart_app.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResponseDTO {
    private Long cart_id;
    private Integer price;
    private String type;
    private Integer productPrice;
    private Integer qty;
    private String name;

    public CartResponseDTO(Long cart_id, Integer price, String type, Integer productPrice, Integer qty, String name) {
        this.cart_id = cart_id;
        this.price = price;
        this.type = type;
        this.productPrice = productPrice;
        this.qty = qty;
        this.name = name;
    }
}
