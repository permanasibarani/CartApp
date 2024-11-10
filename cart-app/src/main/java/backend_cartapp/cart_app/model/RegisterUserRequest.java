package backend_cartapp.cart_app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RegisterUserRequest {
    @NotBlank
    @Size(max = 15)
    private String username;

    @NotBlank
    @Size(max = 15)
    private String password;

    @Size(max = 50)
    @NotBlank
    private String name;
}
