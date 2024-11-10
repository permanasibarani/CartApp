package backend_cartapp.cart_app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Users")

public class User {
    @Id
    @Column(name = "username")
    private String username;

    private String password;
    private String name;
    @Column(name = "role", columnDefinition = "INT DEFAULT 1")
    private Integer role;
    private String token;

    @Column(name = "token_expired_at")
    private Long tokenExpiredAt;

    @Column(name = "created_at", columnDefinition = "TIMESTAMPTZ DEFAULT now()")
    private Instant createdAt;


    @PrePersist
    public void setDefaultValues() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        if (this.role == null) {
            this.role = 1;
        }
    }

    @OneToMany(mappedBy = "user")
    private List<Cart> carts;
}
