package com.cinescope.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    private ObjectId id;
    private String body;
    private String reviewer;
    private String email;
    private double rating;
    private Instant timestamp;

    public Review(String body, String reviewer, String email, double rating, Instant timestamp) {
        this.body = body;
        this.reviewer = reviewer;
        this.email = email;
        this.rating = rating;
        this.timestamp = timestamp;
    }
}
