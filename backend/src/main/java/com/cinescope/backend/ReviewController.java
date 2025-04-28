package com.cinescope.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    AuthService authService = new AuthService();

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, Object> payload,
                                               @RequestHeader("Authorization") String authorizationHeader,
                                               @RequestHeader("x-refresh-token") String refreshToken) {
        String sessionToken = authorizationHeader.replace("Bearer ", "");

        // Check if session is valid
        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String body = (String) payload.get("reviewBody");
        String reviewer = (String) payload.get("reviewer");
        String email = (String) payload.get("email");
        double rating = Double.parseDouble(payload.get("rating").toString());
        Instant lastModifiedAt = Instant.parse((String) payload.get("lastModifiedAt"));
        String imdbId = (String) payload.get("imdbId");

        Review review = reviewService.createReview(body, reviewer, email, rating, lastModifiedAt, imdbId);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @PutMapping("/{reviewUid}")
    public ResponseEntity<Review> updateReview(
            @PathVariable String reviewUid,
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken) {
        String sessionToken = authorizationHeader.replace("Bearer ", "");
        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String body = (String) payload.get("reviewBody");
        double rating = Double.parseDouble(payload.get("rating").toString());
        Instant lastModifiedAt = Instant.parse((String) payload.get("lastModifiedAt"));
        String imdbId = (String) payload.get("imdbId");

        Review updatedReview = reviewService.updateReview(reviewUid, body, rating, lastModifiedAt, imdbId);

        if (updatedReview != null) {
            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{reviewUid}")
    public ResponseEntity<?> deleteReview(@PathVariable String reviewUid, @RequestParam String imdbId,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @RequestHeader("x-refresh-token") String refreshToken) {
        String sessionToken = authorizationHeader.replace("Bearer ", "");
        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean deleted = reviewService.deleteReview(reviewUid, imdbId);

        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Review not found with UID: " + reviewUid));
        }
    }
}
