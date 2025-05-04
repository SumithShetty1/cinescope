package com.cinescope.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * RootController is a basic Spring Boot REST controller that handles requests
 * to the application's root endpoint ("/").
 * This serves as a simple health check/status endpoint to verify that the backend
 * service is running properly.
 */
@RestController
public class RootController {

    // Handles GET requests to the root endpoint ("/")
    @GetMapping("/")
    public String home() {
        return "Cinescope Backend is running.";
    }
}
