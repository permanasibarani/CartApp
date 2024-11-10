package backend_cartapp.cart_app.repository;

import backend_cartapp.cart_app.entity.Product;
import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.CartResponse;
import backend_cartapp.cart_app.model.CartResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import backend_cartapp.cart_app.entity.Cart;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT new backend_cartapp.cart_app.model.CartResponseDTO(c.cart_id, c.price, p.type, p.price, c.qty, p.name) " +
            "FROM Cart c JOIN c.product p WHERE c.user.username = :username AND c.status = 0")
    Page<CartResponseDTO> findByUsername(@Param("username") String username, Pageable pageable);
    Optional<Cart> findByProductAndUserAndStatus(Product product, User user, Integer status);

    // Query kustom untuk mendapatkan cart berdasarkan username dan nama produk
    @Query("SELECT c FROM Cart c JOIN c.product p WHERE c.user.username = :username AND p.name = :productName")
    List<Cart> findByUsernameAndProductName(@Param("username") String username, @Param("productName") String productName);
}
