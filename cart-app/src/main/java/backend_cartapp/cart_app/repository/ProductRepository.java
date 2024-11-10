package backend_cartapp.cart_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import backend_cartapp.cart_app.entity.Product;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByNameIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.name = :name")
    Product findByName(@Param("name") String name);
}
