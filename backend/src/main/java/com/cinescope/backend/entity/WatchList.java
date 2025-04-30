package com.cinescope.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

/**
 * Represents a user's movie watchlist stored in the 'watchlists' collection in MongoDB.
 */
@Document(collection = "watchlists")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WatchList {
    @Id
    private ObjectId id;
    private String email;
    @DocumentReference(lazy = true)
    private List<Movie> movies;

    // Custom constructor for creating a watchlist without setting an ID
    public WatchList(String email, List<Movie> movies) {
        this.email = email;
        this.movies = movies;
    }
}
