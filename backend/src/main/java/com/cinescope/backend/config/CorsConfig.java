package com.cinescope.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures CORS (Cross-Origin Resource Sharing) settings for the application.
 */
@Configuration
public class CorsConfig {

    // Injects allowed origins from application properties
    @Value("${app.allowed.origins}")
    private String[] allowedOrigins;

    // Defines and returns a WebMvcConfigurer bean to customize CORS mappings
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            // Configures CORS to allow specific origins, methods, and headers
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
