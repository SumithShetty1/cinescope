package com.cinescope.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, Object> payload) {
        String body = (String) payload.get("reviewBody");
        String reviewer = (String) payload.get("reviewer");
        String email = (String) payload.get("email");
        Double rating = Double.parseDouble(payload.get("rating").toString());
        String imdbId = (String) payload.get("imdbId");
        Instant timestamp = Instant.parse((String) payload.get("timestamp"));

        Review review = reviewService.createReview(body, reviewer, email, rating, imdbId, timestamp);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
}
