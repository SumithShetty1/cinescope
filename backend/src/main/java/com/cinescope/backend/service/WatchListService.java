package com.cinescope.backend.service;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.repository.MovieRepository;
import com.cinescope.backend.entity.WatchList;
import com.cinescope.backend.repository.WatchListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for handling WatchList CRUD operations and movie checks.
 */
@Service
public class WatchListService {
    @Autowired
    private WatchListRepository watchListRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    // Retrieves a user's watchlist by email
    public Optional<WatchList> getWatchListByEmail(String email, int limit) {
        if (limit <= 0) {
            return watchListRepository.findWatchListByEmail(email);
        }
        return watchListRepository.findWatchListByEmailWithLimit(email, limit);
    }

    // Checks if a specific movie is in the user's watchlist
    public boolean isMovieInWatchlist(String email, String imdbId) {
        Optional<Movie> movie = movieRepository.findMovieByImdbId(imdbId);
        if (movie.isEmpty())
            return false;

        // Query watchlist where the movie's ID exists in the user's list
        Query query = new Query(Criteria.where("email").is(email)
                .and("movies.id").is(movie.get().getId()));

        return mongoTemplate.exists(query, WatchList.class);
    }

    // Adds a movie to the user's watchlist
    public WatchList addToWatchlist(String email, String imdbId) {
        // Find the movie to add
        Movie movieToAdd = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        // Check if it's already in the watchlist
        Query existsQuery = new Query(
                Criteria.where("email").is(email)
                        .and("movies.id").is(movieToAdd.getId()));

        if (mongoTemplate.exists(existsQuery, WatchList.class)) {
            throw new IllegalArgumentException("Movie already in watchlist");
        }

        // Add movie to watchlist (upsert creates new if not found)
        Query query = new Query(Criteria.where("email").is(email));
        Update update = new Update().push("movies", movieToAdd);

        WatchList updated = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options()
                        .returnNew(true)
                        .upsert(true),
                WatchList.class);

        return updated;
    }

    // Removes a movie from the user's watchlist
    public WatchList removeFromWatchlist(String email, String imdbId) {
        // Get the movie's internal ObjectId
        Movie movie = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));

        // Remove the movie from watchlist using pull operation
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
