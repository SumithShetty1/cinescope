package com.cinescope.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Main entry point for the Spring Boot application
@SpringBootApplication
public class BackendApplication {

    // Starts the embedded server and initializes the Spring application context
    public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
