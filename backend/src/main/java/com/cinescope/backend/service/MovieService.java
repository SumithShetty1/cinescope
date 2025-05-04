package com.cinescope.backend.service;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Comparator;
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
        if (!StringUtils.hasText(imdbId)) {
            throw new IllegalArgumentException("IMDb ID cannot be empty");
        }

        return movieRepository.findMovieByImdbId(imdbId);
    }

    // Get top-rated movies with an optional limit
    public List<Movie> getTopRatedMovies(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByRatingDesc();
        }
        return movieRepository.findTopNRatedMovies(PageRequest.of(0, limit));
    }

    // Get newly released movies with an optional limit
    public List<Movie> getNewReleases(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByReleaseDateDesc();
        }
        return movieRepository.findNewlyReleasedMovies(PageRequest.of(0, limit));
    }

    // Get movies matching a specific genre (case-insensitive)
    public List<Movie> getMoviesByGenre(String genre) {
        if (!StringUtils.hasText(genre)) {
            throw new IllegalArgumentException("Genre cannot be empty");
        }

        List<Movie> all = movieRepository.findByGenreIgnoreCase(genre);
        return all.stream()
                .sorted(Comparator.comparingDouble(Movie::getRating).reversed())
                .collect(Collectors.toList());
    }

    // Searches for movies by title with case-insensitive matching and returns sorted results
    public List<Movie> searchMovies(String query, int limit) {
        if (!StringUtils.hasText(query)) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        List<Movie> results = movieRepository.findByTitleContainingIgnoreCase(query);

        // Sort by best match (movies that start with the query come first)
        results.sort((a, b) -> {
            boolean aStartsWith = a.getTitle().toLowerCase().startsWith(query.toLowerCase());
            boolean bStartsWith = b.getTitle().toLowerCase().startsWith(query.toLowerCase());

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return Double.compare(b.getRating(), a.getRating()); // Then by rating
        });

        return limit > 0 ? results.stream().limit(limit).toList() : results;
    }

    // Add a new movie to the database (admin only)
    public ResponseEntity<?> addMovie(Movie movie) {
        if (movie == null) {
            throw new IllegalArgumentException("Movie cannot be null");
        }

        if (movieRepository.findMovieByImdbId(movie.getImdbId()).isPresent()) {
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
        if (!StringUtils.hasText(imdbId)) {
            throw new IllegalArgumentException("IMDb ID cannot be empty");
        }
        if (updatedMovie == null) {
            throw new IllegalArgumentException("Updated movie cannot be null");
        }

        return movieRepository.findMovieByImdbId(imdbId)
                .map(existing -> {
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
                    return movieRepository.save(existing);
                });
    }

    // Delete a movie by IMDb ID (admin only)
    public boolean deleteMovieByImdbId(String imdbId) {
        if (!StringUtils.hasText(imdbId)) {
            throw new IllegalArgumentException("IMDb ID cannot be empty");
        }

        Optional<Movie> movieOpt = movieRepository.findMovieByImdbId(imdbId);
        if (movieOpt.isPresent()) {
            movieRepository.delete(movieOpt.get());
            return true;
        }
        return false;
    }
}
