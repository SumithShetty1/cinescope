package com.cinescope.backend.repository;

import com.cinescope.backend.entity.Movie;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Movie entity with custom query methods.
 */
@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {
    Optional<Movie> findMovieByImdbId(String imdbId);

    List<Movie> findTop16ByOrderByRatingDesc();
    List<Movie> findTop16ByOrderByReleaseDateDesc();
    List<Movie> findAllByOrderByRatingDesc();
    List<Movie> findAllByOrderByReleaseDateDesc();

    @Query("{ 'genres': { $regex: ?0, $options: 'i' } }")
    List<Movie> findByGenreIgnoreCase(String genre);

    @Query("{ 'genres': { $regex: ?0, $options: 'i' } }")
    List<Movie> findByGenreIgnoreCaseOrderByRatingDesc(String genre);
}
