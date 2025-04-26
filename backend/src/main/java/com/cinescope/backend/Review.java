package com.cinescope.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    private ObjectId id;
    private String reviewUid;
    private String imdbId;
    private String body;
    private String reviewer;
    private String email;
    private double rating;
    private Instant lastModifiedAt;

    public Review(String body, String reviewer, String email, double rating, Instant lastModifiedAt) {
        this.body = body;
        this.reviewer = reviewer;
        this.email = email;
        this.rating = rating;
        this.lastModifiedAt = lastModifiedAt;
        this.reviewUid = generateReviewUid(email, lastModifiedAt);
    }

    private String generateReviewUid(String email, Instant lastModifiedAt) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss")
                .withZone(ZoneId.of("UTC"));
        String timeString = formatter.format(lastModifiedAt);
        return email + "_" + timeString;
    }
}
