package backend_cartapp.cart_app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CreateCartRequest {

    @NotBlank
    @Size(max = 255)
    private String productId;

    @NotBlank
    @Size(max = 100)
    private String username;

    @NotNull
    private Integer qty;

    @NotNull
    private Integer status;
}