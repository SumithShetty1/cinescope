package com.cinescope.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

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

    public WatchList(String email, List<Movie> movies) {
        this.email = email;
        this.movies = movies;
    }
}
