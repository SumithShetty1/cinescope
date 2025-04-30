package com.cinescope.backend.service;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for movie-related operations.
 */
@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    // Get all movies from the database
    public List<Movie> allMovies() {
        return movieRepository.findAll();
    }

    // Get a specific movie by IMDb ID
    public Optional<Movie> singleMovie(String imdbId) {
        return movieRepository.findMovieByImdbId(imdbId);
    }

    // Get top-rated movies with an optional limit
    public List<Movie> getTopRatedMovies(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByRatingDesc();
        }
        return movieRepository.findTop16ByOrderByRatingDesc();
    }

    // Get newly released movies with an optional limit
    public List<Movie> getNewReleases(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByReleaseDateDesc();
        }
        return movieRepository.findTop16ByOrderByReleaseDateDesc();
    }

    // Get movies matching a specific genre (case-insensitive)
    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre);
    }

    // Get top-rated movies by genre with an optional limit
    public List<Movie> getTopRatedMoviesByGenre(String genre, int limit) {
        List<Movie> movies = movieRepository.findByGenreIgnoreCaseOrderByRatingDesc(genre);
        return limit > 0 ? movies.stream().limit(limit).collect(Collectors.toList()) : movies;
    }

    // Add a new movie to the database (admin only)
    public ResponseEntity<?> addMovie(Movie movie) {
        Optional<Movie> existingMovie = movieRepository.findMovieByImdbId(movie.getImdbId());

        if (existingMovie.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Movie with IMDB ID " + movie.getImdbId() + " already exists");
        }

        movie.setRating(0.0);
        movie.setReviewIds(List.of());

        Movie savedMovie = movieRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    // Update an existing movie (admin only)
    public Optional<Movie> updateMovie(String imdbId, Movie updatedMovie) {
        Optional<Movie> existingOpt = movieRepository.findMovieByImdbId(imdbId);

        if (existingOpt.isPresent()) {
            Movie existing = existingOpt.get();

            existing.setTitle(updatedMovie.getTitle());
            existing.setDescription(updatedMovie.getDescription());
            existing.setDuration(updatedMovie.getDuration());
            existing.setDirectors(updatedMovie.getDirectors());
            existing.setWriters(updatedMovie.getWriters());
            existing.setStars(updatedMovie.getStars());
            existing.setReleaseDate(updatedMovie.getReleaseDate());
            existing.setTrailerLink(updatedMovie.getTrailerLink());
            existing.setPoster(updatedMovie.getPoster());
            existing.setGenres(updatedMovie.getGenres());
            existing.setBackdrops(updatedMovie.getBackdrops());

            return Optional.of(movieRepository.save(existing));
        }

        return Optional.empty();
    }

    // Delete a movie by IMDb ID (admin only)
    public boolean deleteMovieByImdbId(String imdbId) {
        Optional<Movie> movieOpt = movieRepository.findMovieByImdbId(imdbId);
        if (movieOpt.isPresent()) {
            movieRepository.delete(movieOpt.get());
            return true;
        }
        return false;
    }
}
