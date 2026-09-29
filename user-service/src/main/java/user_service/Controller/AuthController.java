package user_service.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import user_service.dto.AuthResponse;
import user_service.dto.LoginRequest;
import user_service.dto.RegisterRequest;
import user_service.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            return ResponseEntity.ok(
                    authService.register(request)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(401)
                    .body(e.getMessage());
        }
    }
}
