package com.cinescope.backend.service;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.repository.MovieRepository;
import com.cinescope.backend.entity.Review;
import com.cinescope.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/**
 * Service for handling review creation, update, deletion, and rating recalculation.
 */
@Service
public class ReviewService {
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    // Creates a new review, links it to a movie, and updates the movie rating
    public Review createReview(String body, String reviewer, String email, double rating, Instant lastModifiedAt, String imdbId) {
        Review review = reviewRepository.insert(new Review(body, reviewer, email, rating, lastModifiedAt));

        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds").value(review))
                .first();

        // Recalculate and update movie rating
        updateMovieRating(imdbId);

        return review;
    }

    // Updates an existing review and recalculates movie rating
    public Review updateReview(String reviewUid, String newBody, double newRating, Instant newLastModifiedAt, String imdbId) {
        Optional<Review> optionalReview = reviewRepository.findByReviewUid(reviewUid);

        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();

            review.setBody(newBody);
            review.setRating(newRating);
            review.setLastModifiedAt(newLastModifiedAt);

            Review updatedReview = reviewRepository.save(review);

            // Recalculate and update movie rating
            updateMovieRating(imdbId);

            return updatedReview;
        }

        return null;
    }

    // Deletes a review, removes it from the movie, and updates the movie rating
    public boolean deleteReview(String reviewUid, String imdbId) {
        Optional<Review> optionalReview = reviewRepository.findByReviewUid(reviewUid);

        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();

            Optional<Movie> optionalMovie = movieRepository.findMovieByImdbId(imdbId);
            if (optionalMovie.isPresent()) {
                Movie movie = optionalMovie.get();
                if (movie.getReviewIds() != null) {
                    // Remove the review and save the movie
                    movie.getReviewIds().removeIf(r -> r.getReviewUid().equals(reviewUid));
                    movieRepository.save(movie);
                }
            }

            reviewRepository.delete(review);

            // Recalculate movie rating
            updateMovieRating(imdbId);

            return true;
        }

        return false;
    }

    // Recalculates and updates a movie's average rating based on its reviews
    private void updateMovieRating(String imdbId) {
        // Get the movie with all its reviews
        Movie movie = mongoTemplate.findOne(
                Query.query(Criteria.where("imdbId").is(imdbId)),
                Movie.class
        );

        if (movie != null && movie.getReviewIds() != null) {
            // Calculate new average rating
            double averageRating = movie.getReviewIds().stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Update the movie's rating
            mongoTemplate.updateFirst(
                    Query.query(Criteria.where("imdbId").is(imdbId)),
                    new Update().set("rating", averageRating),
                    Movie.class
            );
        }
    }
}
