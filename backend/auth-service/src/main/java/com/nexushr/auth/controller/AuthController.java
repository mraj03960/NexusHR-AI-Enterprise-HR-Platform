package com.nexushr.auth.controller;

import com.nexushr.auth.entity.User;
import com.nexushr.auth.security.JwtService;
import com.nexushr.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthService authService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        User user = authService.findByUsername(username);

        if (!user.isActive()) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "User account is inactive"));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username", user.getUsername(),
                        "role", user.getRole()
                )
        );
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        return ResponseEntity.ok(authService.findByUsername(username));
    }
}
