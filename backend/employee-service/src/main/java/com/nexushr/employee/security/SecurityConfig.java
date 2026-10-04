package com.nexushr.employee.security;

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

                // Read operations
                .requestMatchers(HttpMethod.GET, "/api/employees/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.GET, "/api/attendance/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.GET, "/api/leaves/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.GET, "/api/roles/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER")

                // Create/update employee data
                .requestMatchers(HttpMethod.POST, "/api/employees/**")
                .hasAnyRole("ADMIN", "HR")

                .requestMatchers(HttpMethod.PUT, "/api/employees/**")
                .hasAnyRole("ADMIN", "HR")

                // Delete employee
                .requestMatchers(HttpMethod.DELETE, "/api/employees/**")
                .hasRole("ADMIN")

                // Attendance
                .requestMatchers(HttpMethod.POST, "/api/attendance/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.DELETE, "/api/attendance/**")
                .hasAnyRole("ADMIN", "HR")

                // Leave
                .requestMatchers(HttpMethod.POST, "/api/leaves/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.PUT, "/api/leaves/**")
                .hasAnyRole("ADMIN", "HR", "MANAGER")

                // Roles
                .requestMatchers(HttpMethod.POST, "/api/roles/**")
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