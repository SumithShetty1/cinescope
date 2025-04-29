package com.cinescope.backend;

import com.descope.client.Config;
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.sdk.auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;

public class AuthService {
    @Value("${descope.project.id}")
    private String projectId;
    private final DescopeClient descopeClient;
    private final AuthenticationService authService;

    public AuthService() {
        // Initialize DescopeClient and AuthenticationService
        this.descopeClient = new DescopeClient(
                Config.builder()
                        .projectId(projectId)
                        .build()
        );
        this.authService = descopeClient.getAuthenticationServices().getAuthService();
    }

    // Method to validate session
    public boolean isSessionValid(String sessionToken, String refreshToken) {
        try {
            authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken);
            return true;
        } catch (DescopeException e) {
            return false;
        }
    }
}
