package com.cinescope.backend;

//import org.bson.types.ObjectId;
import com.descope.client.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//Descope Imports
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.*;
import com.descope.sdk.auth.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

//Descope Imports end

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
    private final DescopeClient descopeClient = new DescopeClient(
            Config.builder()
                    .projectId("P2Y513EdKoAGWqEQe5wP5oeK9Owa") // replace with your actual ID
                    .build());

    private final AuthenticationService authService = descopeClient.getAuthenticationServices().getAuthService();

    private boolean isSessionValid(String sessionToken, String refreshToken) {
        try {
            authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken);
            return true;
        } catch (DescopeException e) {
            return false;
        }
    }

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies(), HttpStatus.OK);
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<Optional<Movie>> getSingleMovies(@PathVariable String imdbId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(imdbId), HttpStatus.OK);
    }

    @GetMapping("/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<List<Movie>>(movieService.getTopRatedMovies(actualLimit), HttpStatus.OK);
    }

    @GetMapping("/new-releases/{limit}")
    public ResponseEntity<List<Movie>> getNewReleases(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<List<Movie>>(movieService.getNewReleases(actualLimit), HttpStatus.OK);
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Movie>> getMoviesByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
    }

    @GetMapping("/genre/{genre}/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMoviesByGenre(
            @PathVariable String genre,
            @PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 0;
        return ResponseEntity.ok(movieService.getTopRatedMoviesByGenre(genre, actualLimit));
    }

    // @PostMapping
    // public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
    // Movie savedMovie = movieService.addMovie(movie);
    // return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    // }

    @PostMapping
    public ResponseEntity<?> addMovie(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken,
            @RequestBody Movie movie) {

        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session.");
        }

        Movie savedMovie = movieService.addMovie(movie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{imdbId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String imdbId, @RequestBody Movie updatedMovie) {
        Optional<Movie> movieOpt = movieService.updateMovie(imdbId, updatedMovie);
        return movieOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{imdbId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String imdbId) {
        boolean deleted = movieService.deleteMovieByImdbId(imdbId);
        if (deleted) {
            return ResponseEntity.ok("Movie deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }
    }
}
