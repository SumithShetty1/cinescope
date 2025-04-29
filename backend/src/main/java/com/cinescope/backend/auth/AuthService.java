package com.cinescope.backend.auth;

import com.descope.client.Config;
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    private final AuthenticationService authService;
    private Token verifiedToken;

    public AuthService(@Value("${descope.project.id}") String projectId) {
        DescopeClient descopeClient = new DescopeClient(
                Config.builder().projectId(projectId).build()
        );
        this.authService = descopeClient.getAuthenticationServices().getAuthService();
    }

    public boolean isSessionValid(String sessionToken, String refreshToken) {
        try {
            verifiedToken = authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken);
            return true;
        } catch (DescopeException e) {
            return false;
        }
    }

    public boolean isAdmin() {
        try {
            return authService.validateRoles(verifiedToken, Collections.singletonList("admin"));
        } catch (DescopeException e) {
            System.err.println("Error validating admin role: " + e.getMessage());
            return false;
        }
    }

    public Token getVerifiedToken() {
        return verifiedToken;
    }
}
