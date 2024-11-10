package backend_cartapp.cart_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import backend_cartapp.cart_app.entity.User;
import backend_cartapp.cart_app.model.LoginUserRequest;
import backend_cartapp.cart_app.model.TokenResponse;
import backend_cartapp.cart_app.repository.UserRepository;
import backend_cartapp.cart_app.security.BCrypt;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Transactional
    public TokenResponse login(LoginUserRequest request) {
        validationService.validate(request);

        User user = userRepository.findById(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Username or password wrong"));

        if (BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            user.setToken(UUID.randomUUID().toString());
            user.setTokenExpiredAt(next7Days());
            userRepository.save(user);

            return TokenResponse.builder()
                    .token(user.getToken())
                    .expired_at(user.getTokenExpiredAt())
                    .username(user.getUsername())
                    .role(user.getRole())
                    .build();
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Username or password wrong");
        }
    }

    private Long next7Days() {
        return System.currentTimeMillis() + (1000 * 60 * 60 * 24 * 7);
    }

    @Transactional
    public void logout(User user) {
        user.setToken(null);
        user.setTokenExpiredAt(null);

        userRepository.save(user);
    }
}