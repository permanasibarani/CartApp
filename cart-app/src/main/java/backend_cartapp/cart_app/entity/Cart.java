package backend_cartapp.cart_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Carts")

public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cart_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private User user;

    @Column(name = "status", columnDefinition = "INT DEFAULT 0")
    private Integer status;

    @Column(name = "qty", columnDefinition = "INT DEFAULT 1")
    private Integer qty;

    @Column(name = "price", nullable = false)
    private Integer price;

    @PrePersist
    public void setDefaultValues() {
        if (this.status == null) {
            this.status = 0;
        }
        if (this.qty == null) {
            this.qty = 1;
        }
    }
}
