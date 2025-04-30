package com.cinescope.backend.controller;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.auth.AuthService;
import com.cinescope.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing movie-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private AuthService authService;

    // Get all movies
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<>(movieService.allMovies(), HttpStatus.OK);
    }

    // Get a single movie by IMDb ID
    @GetMapping("/{imdbId}")
    public ResponseEntity<Optional<Movie>> getSingleMovies(@PathVariable String imdbId) {
        return new ResponseEntity<>(movieService.singleMovie(imdbId), HttpStatus.OK);
    }

    // Get top-rated movies, limited to a given number (default 16)
    @GetMapping("/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<>(movieService.getTopRatedMovies(actualLimit), HttpStatus.OK);
    }

    // Get newest released movies, limited to a given number (default 16)
    @GetMapping("/new-releases/{limit}")
    public ResponseEntity<List<Movie>> getNewReleases(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<>(movieService.getNewReleases(actualLimit), HttpStatus.OK);
    }

    // Get movies by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Movie>> getMoviesByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
    }

    // Get top-rated movies by genre, optionally limited
    @GetMapping("/genre/{genre}/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMoviesByGenre(
            @PathVariable String genre,
            @PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 0;
        return ResponseEntity.ok(movieService.getTopRatedMoviesByGenre(genre, actualLimit));
    }

    // Add a new movie (admin only)
    @PostMapping
    public ResponseEntity<?> addMovie(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken,
            @RequestBody Movie movie) {

        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session.");
        }
        if (!authService.isAdmin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return movieService.addMovie(movie);
    }

    // Update an existing movie (admin only)
    @PutMapping("/{imdbId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String imdbId,
                                             @RequestBody Movie updatedMovie,
                                             @RequestHeader("Authorization") String authorizationHeader,
                                             @RequestHeader("x-refresh-token") String refreshToken) {
        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!authService.isAdmin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Movie> movieOpt = movieService.updateMovie(imdbId, updatedMovie);
        return movieOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Delete a movie by IMDb ID (admin only)
    @DeleteMapping("/{imdbId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String imdbId,
                                              @RequestHeader("Authorization") String authorizationHeader,
                                              @RequestHeader("x-refresh-token") String refreshToken) {

        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!authService.isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!authService.isAdmin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean deleted = movieService.deleteMovieByImdbId(imdbId);
        if (deleted) {
            return ResponseEntity.ok("Movie deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }
    }
}
