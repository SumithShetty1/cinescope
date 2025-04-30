package com.cinescope.backend.auth;

import com.descope.client.Config;
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service for handling authentication and session validation using Descope.
 */
@Service
public class AuthService {

    private final AuthenticationService authService;
    private Token verifiedToken;

    // Initializes Descope client and authentication service using the project ID
    public AuthService(@Value("${descope.project.id}") String projectId) {
        DescopeClient descopeClient = new DescopeClient(
                Config.builder().projectId(projectId).build()
        );
        this.authService = descopeClient.getAuthenticationServices().getAuthService();
    }

    // Validates or refreshes the session using session and refresh tokens
    public boolean isSessionValid(String sessionToken, String refreshToken) {
        try {
            verifiedToken = authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken);
            return true;
        } catch (DescopeException e) {
            return false;
        }
    }

    // Checks if the user has an "admin" role
    public boolean isAdmin() {
        try {
            return authService.validateRoles(verifiedToken, Collections.singletonList("admin"));
        } catch (DescopeException e) {
            System.err.println("Error validating admin role: " + e.getMessage());
            return false;
        }
    }

    // Returns the verified JWT token
    public Token getVerifiedToken() {
        return verifiedToken;
    }
}
