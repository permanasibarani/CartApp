package backend_cartapp.cart_app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Products")

public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "sku", nullable = false)
    private String sku;

    @Column(name = "stock", columnDefinition = "INT DEFAULT 0")
    private Integer stock;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "price", columnDefinition = "INT DEFAULT 0")
    private Integer price;

    @PrePersist
    public void setDefaultValues() {
        if (this.stock == null) {
            this.stock = 0;
        }
        if (this.price == null) {
            this.price = 0;
        }
    }

    @OneToMany(mappedBy = "product")
    private List<Cart> carts;
}
