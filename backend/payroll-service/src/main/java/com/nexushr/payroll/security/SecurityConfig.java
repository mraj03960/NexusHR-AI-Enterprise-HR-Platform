package com.nexushr.payroll.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers("/actuator/health")
                .permitAll()

                .requestMatchers(HttpMethod.GET, "/api/payroll/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.POST, "/api/payroll/**")
                .hasAnyRole("ADMIN", "HR")

                .requestMatchers(HttpMethod.PUT, "/api/payroll/**")
                .hasAnyRole("ADMIN", "HR")

                .requestMatchers(HttpMethod.DELETE, "/api/payroll/**")
                .hasRole("ADMIN")

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}