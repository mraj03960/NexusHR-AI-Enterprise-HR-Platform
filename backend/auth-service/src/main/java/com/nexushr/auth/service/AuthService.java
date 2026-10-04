package com.nexushr.auth.service;

import com.nexushr.auth.entity.User;
import com.nexushr.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {

    // Public registration should never create privileged accounts
    user.setRole("EMPLOYEE");

    user.setPassword(passwordEncoder.encode(user.getPassword()));

    return userRepository.save(user);
}

    public User findByUsername(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}