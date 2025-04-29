package com.cinescope.backend.service;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.repository.MovieRepository;
import com.cinescope.backend.entity.WatchList;
import com.cinescope.backend.repository.WatchListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WatchListService {
    @Autowired
    private WatchListRepository watchListRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public Optional<WatchList> getWatchListByEmail(String email) {
        return watchListRepository.findWatchListByEmail(email);
    }

    public boolean isMovieInWatchlist(String email, String imdbId) {
        Optional<Movie> movie = movieRepository.findMovieByImdbId(imdbId);
        if (movie.isEmpty())
            return false;

        Query query = new Query(Criteria.where("email").is(email)
                .and("movies.id").is(movie.get().getId())); // Query by reference ID

        return mongoTemplate.exists(query, WatchList.class);
    }

    public WatchList addToWatchlist(String email, String imdbId) {
        // Verify movie exists first (throws 404 if not found)
        Movie movieToAdd = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        // Check if already in watchlist using consistent field
        Query existsQuery = new Query(
                Criteria.where("email").is(email)
                        .and("movies.id").is(movieToAdd.getId()));

        if (mongoTemplate.exists(existsQuery, WatchList.class)) {
            throw new IllegalArgumentException("Movie already in watchlist");
        }

        // Atomic update operation
        Query query = new Query(Criteria.where("email").is(email));
        Update update = new Update().push("movies", movieToAdd);

        // Perform the update with upsert
        WatchList updated = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options()
                        .returnNew(true)
                        .upsert(true),
                WatchList.class);

        return updated;
    }

    public WatchList removeFromWatchlist(String email, String imdbId) {
        // First get the movie's ObjectId from the imdbId
        Movie movie = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        // Update using the movie's ObjectId
        Query query = new Query(Criteria.where("email").is(email));
        Update update = new Update().pull("movies", movie.getId());

        WatchList updated = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                WatchList.class);

        if (updated == null) {
            throw new IllegalArgumentException("Watchlist not found");
        }

        return updated;
    }
}
